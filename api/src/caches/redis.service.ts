import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ICacheService } from './cache.service';

@Injectable()
export class RedisService implements ICacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async setToken(
    jti: string,
    refreshToken: string,
    timeIssues: number,
    timeExpires: number,
  ): Promise<void> {
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
    const data = await this.cacheManager.get(`refresh_token:${jti}`);

    return data !== null;
  }
}
