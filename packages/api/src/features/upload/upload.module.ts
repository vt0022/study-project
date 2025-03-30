import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UploadMiddleware } from 'src/common/middlewares/upload.middleware';
import { UploadFirebaseService } from './uploadFirebase.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UploadFirebaseService],
  exports: [UploadFirebaseService],
})
export class UploadModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware)
      .forRoutes({ path: 'api/posts/upload', method: RequestMethod.POST });
  }
}
