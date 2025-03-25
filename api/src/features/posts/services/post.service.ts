import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/features/users/services/user.service';
import { PostAddDto } from '../dto/postAdd.dto';
import { Post } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UploadFirebaseService } from 'src/features/upload/uploadFirebase.service';

@Injectable()
export class PostService {
  constructor(
    @InjectQueue('thumbnail')
    private thumbnailQueue: Queue,
    private postRepository: PostRepository,
    private userService: UserService,
    private uploadFirebaseService: UploadFirebaseService,
  ) {}

  async createPost(
    userId: number,
    postAddDto: PostAddDto,
    file: Express.Multer.File,
  ): Promise<any> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    const fileUrl = await this.uploadFirebaseService.uploadFile(file);

    let newPost = new Post();
    newPost.content = postAddDto.content;
    newPost.imageUrl = fileUrl;
    newPost.user = user;
    newPost = await this.postRepository.savePost(newPost);

    // Add to queue
    await this.thumbnailQueue.add('thumbnail', {
      fileUrl: fileUrl,
      postId: newPost.id,
    });
  }

  async updateThumbnail(postId: number, thumbnailUrl: string): Promise<void> {
    const post = await this.postRepository.findPostById(postId);

    if (post) {
      post.thumbnailUrl = thumbnailUrl;
      this.postRepository.savePost(post);
    }
  }
}
