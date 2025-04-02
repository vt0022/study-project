import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Like } from '../entities/like.entity';

@Injectable()
export class LikeRepository extends Repository<Like> {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    super(Like, entityManager);
  }

  async findLike(userId: number, postId: number): Promise<Like | null> {
    return await this.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });
  }

  async saveLike(like: Like): Promise<Like> {
    return await this.save(like);
  }

  async deleteLike(likeId: number): Promise<void> {
    await this.delete(likeId);
  }
}
