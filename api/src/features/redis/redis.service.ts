import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async setToken(userId: number, refreshToken: string): Promise<void> {
    // Get
    const refreshTokenList: string[] =
      (await this.cacheManager.get(`refresh_token:user:${userId}`)) || [];

    // Add
    refreshTokenList.push(refreshToken);

    // Set
    await this.cacheManager.set(
      `refresh_token:user:${userId}`,
      refreshTokenList,
    );
  }

  async checkToken(userId: number, refreshToken: string): Promise<boolean> {
    // Get
    const refreshTokenList: string[] = await this.cacheManager.get(
      `refresh_token:user:${userId}`,
    );

    // Check
    return (
      Array.isArray(refreshTokenList) && refreshTokenList.includes(refreshToken)
    );
  }
}
