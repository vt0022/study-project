import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../services/post.service';
import { UploadModule } from 'src/domains/upload/upload.module';
import { PostRepository } from '../repositories/post.repository';
import { UserModule } from 'src/domains/users/modules/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UploadModule, UserModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
