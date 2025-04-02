import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginationMetaData } from 'src/common/pagination/pagination.metadata';
import { PaginationOptions } from 'src/common/pagination/pagination.option';
import { UserService } from 'src/features/users/services/user.service';
import { AddCommentDto } from '../dto/addComment.dto';
import { CommentDto } from '../dto/comment.dto';
import { Comment } from '../entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { PostService } from './post.service';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private userService: UserService,
    private postService: PostService,
  ) {}

  async createComment(
    userId: number,
    postId: number,
    addCommentDto: AddCommentDto,
  ): Promise<CommentDto> {
    const user = await this.userService.findUserById(userId);
    const post = await this.postService.findPostById(postId);
    const parentComment = addCommentDto.parent_comment_id
      ? await this.commentRepository.findCommentById(
          addCommentDto.parent_comment_id,
        )
      : null;

    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    if (!post) {
      throw new BadRequestException('Invalid post');
    }

    const comment = new Comment();
    comment.content = addCommentDto.content;
    comment.post = post;
    comment.user = user;
    comment.parentComment = parentComment;

    const newComment = this.commentRepository.save(comment);

    const commentDto = this.convertToCommentDto([newComment]);

    return commentDto[0];
  }

  async getCommentsOfPost(
    postId: number,
    paginationOptions: PaginationOptions,
  ): Promise<{ data: CommentDto[]; metadata: PaginationMetaData }> {
    const commentData = await this.commentRepository.findCommentsForPost(
      postId,
      paginationOptions,
    );

    const commentDtoList = await this.convertToCommentDto(commentData.data);

    return {
      data: commentDtoList,
      metadata: commentData.metadata,
    };
  }

  async convertToCommentDto(commentData: any): Promise<CommentDto[]> {
    const commentDtoList = await Promise.all(
      commentData.map(async (comment: Comment) => {
        const commentDto = plainToInstance(CommentDto, comment, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const childCommentDtoList = comment.childComments?.length
          ? await this.convertToCommentDto(comment.childComments)
          : [];

        commentDto.childComments = childCommentDtoList;

        return commentDto;
      }),
    );

    return commentDtoList;
  }
}
