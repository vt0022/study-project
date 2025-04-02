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

  // When user log out
  async setTokenIntoBlackList(
    jti: string,
    refreshToken: string,
    timeIssues: number,
    timeExpires: number,
  ): Promise<void> {
    // TTL is in milisecond
    await this.cacheManager.set(
      `revoked_refresh_token:${jti}`,
      refreshToken,
      (timeExpires - timeIssues) * 1000,
    );
  }

  // When user log in
  async setTokenIntoActiveList(
    userId: number,
    jti: string,
    refreshToken: string,
    timeIssues: number,
    timeExpires: number,
  ): Promise<void> {
    const tokenList =
      (await this.cacheManager.get(`active_refresh_token:user:${userId}`)) ||
      [];

    if (!Array.isArray(tokenList)) {
      throw new Error('Invalid token list format');
    }

    tokenList.push({
      jti: jti,
      refreshToken: refreshToken,
      ttl: (timeExpires - timeIssues) * 1000,
    });

    await this.cacheManager.set(
      `active_refresh_token:user:${userId}`,
      tokenList,
    );
  }

  // When user log out in all devices
  async setAllActiveTokensIntoBlackList(userId: number): Promise<void> {
    const tokenList =
      (await this.cacheManager.get(`active_refresh_token:user:${userId}`)) ||
      [];

    if (!Array.isArray(tokenList)) {
      throw new Error('Invalid token list format');
    }

    for (const token of tokenList) {
      await this.cacheManager.set(
        `user:${userId}:active_refresh_token:${token.jti}`,
        token.refreshToken,
        token.ttl,
      );
    }
  }

  // When user log out, then get from active then put into black list
  async delTokenFromActiveList(userId: number, jti: string): Promise<void> {
    const tokenList =
      (await this.cacheManager.get(`active_refresh_token:user:${userId}`)) ||
      [];

    if (!Array.isArray(tokenList)) {
      throw new Error('Invalid token list format');
    }

    const updatedTokenList = tokenList.filter((token) => token.jti !== jti);

    await this.cacheManager.set(
      `active_refresh_token:user:${userId}`,
      updatedTokenList,
    );
  }

  // Check on get new access token
  async checkTokenInBlackList(jti: string): Promise<boolean> {
    const token = await this.cacheManager.get(`revoked_refresh_token:${jti}`);

    return token !== null;
  }
}
