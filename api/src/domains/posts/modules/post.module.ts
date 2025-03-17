import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../services/post.service';
import { UploadModule } from 'src/domains/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UploadModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
