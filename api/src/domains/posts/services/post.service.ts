import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';
import { PostAddDto } from '../dto/postAdd.dto';
import { UserService } from 'src/domains/users/services/user.service';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private userService: UserService,
  ) {}

  async createPost(userId: number, postAddDto: PostAddDto): Promise<Post> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    const newPost = new Post();
    newPost.content = postAddDto.content;
    newPost.user = user;

    return this.postRepository.save(newPost);
  }
}
