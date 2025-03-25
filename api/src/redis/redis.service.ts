import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async setToken(
    jti: string,
    refreshToken: string,
    timeIssues: number,
    timeExpires: number,
  ): Promise<void> {
    // Get
    // const refreshTokenList: string[] =
    //   (await this.cacheManager.get(`refresh_token:user:${userId}`)) || [];
    // // Add
    // refreshTokenList.push(refreshToken);
    // Set
    // await this.cacheManager.set(
    //   `refresh_token:user:${userId}`,
    //   refreshTokenList,
    // );
    const data = {
      refreshToken: refreshToken,
      blacklisted_at: new Date().toLocaleString(),
      expire_at: new Date(timeExpires * 1000).toLocaleString(),
    };
    // TTL is in milisecond
    await this.cacheManager.set(
      `refresh_token:${jti}`,
      JSON.stringify(data),
      (timeExpires - timeIssues) * 1000,
    );
  }

  async checkToken(jti: string): Promise<boolean> {
    // Get
    // const refreshTokenList: string[] = await this.cacheManager.get(
    //   `refresh_token:user:${userId}`,
    // );
    const data = await this.cacheManager.get(`refresh_token:${jti}`);

    // Check
    // return (
    //   Array.isArray(refreshTokenList) && refreshTokenList.includes(refreshToken)
    // );
    return data !== null;
  }
}
