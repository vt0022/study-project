import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { PaginationOptions } from 'src/common/pagination/pagination.option';
import { UploadFirebaseService } from 'src/features/upload/uploadFirebase.service';
import { UserService } from 'src/features/users/services/user.service';
import { AddPostDto } from '../dto/addPost.dto';
import { DetailPostDto } from '../dto/detailPost.dto';
import { EditPostDto } from '../dto/editPost.dto';
import { PostDto } from '../dto/post.dto';
import { Post } from '../entities/post.entity';
import { LikeRepository } from '../repositories/like.repository';
import { PostRepository } from '../repositories/post.repository';
import { Like } from '../entities/like.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectQueue('thumbnail')
    private thumbnailQueue: Queue,
    private postRepository: PostRepository,
    private userService: UserService,
    private uploadFirebaseService: UploadFirebaseService,
    private likeRepository: LikeRepository,
  ) {}

  async createPost(
    userId: number,
    addPostDto: AddPostDto,
    file: Express.Multer.File,
  ): Promise<DetailPostDto> {
    // Find and handle user
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    // New post
    let newPost = new Post();
    newPost.content = addPostDto.content;
    newPost.isPrivate = addPostDto.isPrivate;
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
      // Save and convert
      newPost = await this.postRepository.savePost(newPost);

      const post = await this.postRepository.findDetailPost(newPost.id);

      const postDto = plainToInstance(DetailPostDto, post, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      // Add to queue
      if (file) {
        await this.thumbnailQueue.add('thumbnail', {
          fileUrl: fileUrl,
          postId: newPost.id,
        });
      }

      return postDto;
    } catch {
      // Rollback uploading image
      // Rollback saving post
      try {
        await this.uploadFirebaseService.deleteFile(fileUrl);
        console.log('Rollack file');
      } catch {
        console.log('Failed to rollack file');
      }
      throw new BadRequestException('Failed to create post');
    }
  }

  async editPost(
    postId: number,
    editPostDto: EditPostDto,
    file: Express.Multer.File,
  ): Promise<DetailPostDto> {
    // Find and handle post
    const post = await this.postRepository.findPostById(postId);
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    post.content = editPostDto.content;
    post.isPrivate = editPostDto.isPrivate;
    post.updatedAt = new Date();

    // Upload and handle file
    let fileUrl = '';
    // User send image
    if (file) {
      try {
        fileUrl = await this.uploadFirebaseService.uploadFile(file);
        post.imageUrl = fileUrl;
        post.thumbnailUrl = null;
      } catch {
        throw new BadRequestException('Error uploading file');
      }
    } else {
      // User not send image but there is already image before
      if (post.imageUrl) {
        await this.thumbnailQueue.add('remove_thumbnail', {
          imageUrl: post.imageUrl,
          thumbnailUrl: post.thumbnailUrl,
        });
      }
    }

    try {
      const editedPost = await this.postRepository.savePost(post);

      const postDto = plainToInstance(DetailPostDto, editedPost, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

      // Generate thumbnail
      if (file) {
        await this.thumbnailQueue.add('generate_thumbnail', {
          fileUrl: fileUrl,
          postId: postId,
        });
      }

      // Remove old image and thumbnail
      if (post.thumbnailUrl && post.imageUrl) {
        await this.thumbnailQueue.add('remove_thumbnail', {
          imageUrl: post.imageUrl,
          thumbnailUrl: post.thumbnailUrl,
        });
      }

      return postDto;
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

  async getPostsForUser(
    userId: number,
    paginationOptions: PaginationOptions,
  ): Promise<any> {
    const postData = await this.postRepository.findPostsForUser(
      userId,
      paginationOptions,
    );

    const postDtoList = await Promise.all(
      postData.data.map(async (post: any) => {
        const postDto = plainToInstance(PostDto, post, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const like = await this.likeRepository.findLike(userId, post.id);
        postDto.isLiked = like !== null;
        postDto.totalLikes = post.likeCount;
        postDto.totalComments = 0;
        return postDto;
      }),
    );

    return {
      data: postDtoList,
      metadata: postData.metadata,
    };
  }

  async getPostsOfUser(
    userId: number,
    paginationOptions: PaginationOptions,
  ): Promise<any> {
    const postData = await this.postRepository.findPostsOfUser(
      userId,
      paginationOptions,
    );

    const postDtoList = await Promise.all(
      postData.data.map(async (post: Post) => {
        const postDto = plainToInstance(PostDto, post, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });

        const like = await this.likeRepository.findLike(userId, post.id);
        postDto.isLiked = like !== null;
        postDto.totalLikes = post.likes.length;
        postDto.totalComments = 0;
        return postDto;
      }),
    );

    return {
      data: postDtoList,
      metadata: postData.metadata,
    };
  }

  async getAllPosts(paginationOptions: PaginationOptions): Promise<any> {
    const postData = await this.postRepository.findAllPosts(paginationOptions);

    const postDtoList = postData.data.map((post: Post) => {
      const postDto = plainToInstance(PostDto, post, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      postDto.totalLikes = post.likes.length;
      postDto.totalComments = 0;
      return postDto;
    });

    return {
      data: postDtoList,
      metadata: postData.metadata,
    };
  }

  async getDetailPost(postId: number): Promise<DetailPostDto> {
    const post = await this.postRepository.findDetailPost(postId);

    const postDto = plainToInstance(DetailPostDto, post, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    postDto.totalLikes = 0;
    postDto.totalComments = 0;

    return postDto;
  }

  async deletePost(postId: number): Promise<void> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    await this.postRepository.deletePostById(postId);
  }

  async likePost(postId: number, userId: number): Promise<boolean> {
    const post = await this.postRepository.findPostById(postId);
    const user = await this.userService.findUserById(userId);

    let like = await this.likeRepository.findLike(userId, postId);

    if (!like) {
      like = new Like();
      like.user = user;
      like.post = post;
      await this.likeRepository.saveLike(like);
      return true;
    }

    await this.likeRepository.deleteLike(like.id);
    return false;
  }
}
