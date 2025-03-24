import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [],
  providers: [RedisService],
  controllers: [],
  exports: [RedisService],
})
export class RedisModule {}
