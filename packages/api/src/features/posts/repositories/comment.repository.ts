import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { PaginationOptions } from 'src/common/pagination/pagination.option';
import { PaginationMetaData } from 'src/common/pagination/pagination.metadata';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    super(Comment, entityManager);
  }

  async findCommentById(id: number): Promise<Comment | null> {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  }

  async findCommentsForPost(
    postId: number,
    paginationOptions: PaginationOptions,
  ): Promise<{ data: Comment[]; metadata: PaginationMetaData }> {
    const [commentList, count] = await this.findAndCount({
      where: {
        post: { id: postId },
        parentComment: null,
      },
      relations: {
        user: true,
        childComments: {
          user: true,
          childComments: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (paginationOptions.page - 1) * paginationOptions.size,
      take: paginationOptions.size,
    });

    const totalPages = Math.ceil(count / paginationOptions.size);

    const paginationMetaData: PaginationMetaData = {
      page: paginationOptions.page,
      size: paginationOptions.size,
      totalPages: totalPages,
      totalItems: count,
      hasPreviousPage: paginationOptions.page > 1,
      hasNextPage: paginationOptions.page < totalPages,
    };

    return {
      data: commentList,
      metadata: paginationMetaData,
    };
  }

  async saveComment(comment: Comment): Promise<Comment> {
    return await this.save(comment);
  }

  async deleteComment(id: number): Promise<void> {
    await this.delete(id);
  }
}
