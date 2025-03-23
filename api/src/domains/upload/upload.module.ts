import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UploadFirebaseService } from './uploadFirebase.service';
import { UploadMiddleware } from 'src/common/middlewares/upload.middleware';
import { UploadSupabaseService } from './uploadSupabase.service';
import { BullModule } from '@nestjs/bullmq';
import { ThumbnailConsumer } from './thumbnail.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'thumbnail',
    }),
  ],
  controllers: [],
  providers: [UploadFirebaseService, UploadSupabaseService, ThumbnailConsumer],
  exports: [UploadFirebaseService, UploadSupabaseService],
})
export class UploadModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware)
      .forRoutes({ path: 'api/posts/upload', method: RequestMethod.POST });
  }
}
