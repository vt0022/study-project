import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    super(Post, entityManager);
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
