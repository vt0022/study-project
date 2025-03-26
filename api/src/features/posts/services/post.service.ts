import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/features/users/services/user.service';
import { PostAddDto } from '../dto/addPost.dto';
import { Post } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UploadFirebaseService } from 'src/features/upload/uploadFirebase.service';
import { PostDto } from '../dto/post.dto';
import { plainToInstance } from 'class-transformer';

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
    // Find and handle user
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    // New post
    let newPost = new Post();
    newPost.content = postAddDto.content;
    newPost.user = user;

    // Upload and handle file
    let fileUrl = '';
    if (file) {
      try {
        fileUrl = await this.uploadFirebaseService.uploadFile(file);
        newPost.imageUrl = fileUrl;
      } catch {
        throw new BadRequestException('Error uploading file');
      }
    }

    try {
      newPost = await this.postRepository.savePost(newPost);
    } catch {
      // Rollback uploading image
      try {
        await this.uploadFirebaseService.deleteFile(fileUrl);
        console.log('Rollack file');
      } catch {
        console.log('Failed to rollack file');
      }
      throw new BadRequestException('Failed to create post');
    }

    // Add to queue
    await this.thumbnailQueue.add('thumbnail', {
      fileUrl: fileUrl,
      postId: newPost.id,
    });
  }

  async updateThumbnail(postId: number, thumbnailUrl: string): Promise<void> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new BadRequestException('Error processing thumbnail');
    }

    try {
      post.thumbnailUrl = thumbnailUrl;
      this.postRepository.savePost(post);
    } catch {
      try {
        await this.uploadFirebaseService.deleteFile(thumbnailUrl);
        console.log('Rollack thumbnail');
      } catch {
        console.log('Failed to rollack thumbnail');
      }
    }
  }

  async getPostsForUser(userId: number): Promise<PostDto[]> {
    const postList = await this.postRepository.findPostsForUser(userId);

    const postDtoList = postList.map((post) => {
      const postDto = plainToInstance(PostDto, post, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      postDto.totalLikes = 0;
      postDto.totalComments = 0;
      return postDto;
    });

    console.log(postDtoList);

    return postDtoList;
  }
}
