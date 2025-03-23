import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/domains/users/services/user.service';
import { PostAddDto } from '../dto/postAdd.dto';
import { Post } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';

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
