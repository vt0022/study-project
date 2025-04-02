import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { PostController } from '../controllers/post.controller';
import { PostService } from '../services/post.service';
import { UploadModule } from 'src/features/upload/upload.module';
import { PostRepository } from '../repositories/post.repository';
import { UserModule } from 'src/features/users/modules/user.module';
import { UploadMiddleware } from 'src/common/middlewares/upload.middleware';
import { BullModule } from '@nestjs/bullmq';
import { LikeRepository } from '../repositories/like.repository';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';
import { CommentService } from '../services/comment.service';
import { CommentRepository } from '../repositories/comment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, Comment]),
    BullModule.registerQueue({
      name: 'thumbnail',
    }),
    UploadModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [
    PostService,
    CommentService,
    CommentRepository,
    PostRepository,
    LikeRepository,
  ],
  exports: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes('posts');
  }
}
