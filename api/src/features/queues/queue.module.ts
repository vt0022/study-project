import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PostModule } from '../posts/modules/post.module';
import { UploadModule } from '../upload/upload.module';
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
  providers: [ThumbnailConsumer],
  exports: [],
})
export class QueueModule {}

// constructor(@InjectQueue('thumbnail') private readonly queue: Queue) {}

//   configure(consumer: MiddlewareConsumer) {
//     const serverAdapter = new ExpressAdapter();
//     serverAdapter.setBasePath('/api/queues');

//     createBullBoard({
//       queues: [new BullMQAdapter(this.queue)],
//       serverAdapter,
//     });

//     consumer.apply(serverAdapter.getRouter()).forRoutes('/queues');
//   }
