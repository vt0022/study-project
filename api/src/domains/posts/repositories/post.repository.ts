import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {
    super(postRepository.target, postRepository.manager);
  }

  async findPostById(id: number): Promise<Post | null> {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  }

  async savePost(post: Post): Promise<Post> {
    return await this.save(post);
  }
}
