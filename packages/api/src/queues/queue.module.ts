import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PostModule } from 'src/features/posts/modules/post.module';
import { UploadModule } from 'src/features/upload/upload.module';
import { ThumbnailService } from './services/thumbnail.service';
import { ThumbnailConsumer } from './consumers/thumbnail.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'thumbnail',
    }),
    BullBoardModule.forFeature({
      name: 'thumbnail',
      adapter: BullMQAdapter,
    }),
    PostModule,
    UploadModule,
  ],
  controllers: [],
  providers: [ThumbnailService, ThumbnailConsumer],
  exports: [],
})
export class QueueModule {}
