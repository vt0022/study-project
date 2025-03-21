import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refreshToken.entity';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    super(RefreshToken, entityManager);
  }

  async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  }

  async saveRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken> {
    return await this.save(refreshToken);
  }

  async revokeRefreshToken(refreshToken: RefreshToken): Promise<void> {
    await this.save(refreshToken);
  }
}
