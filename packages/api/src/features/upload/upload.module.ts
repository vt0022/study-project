import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UploadMiddleware } from 'src/common/middlewares/upload.middleware';
import { UploadFirebaseService } from './uploadFirebase.service';
import { ServiceConstants } from 'src/common/constants/service.constant';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: ServiceConstants.UPLOAD_FIREBASE_SERVICE,
      useClass: UploadFirebaseService,
    },
  ],
  exports: [ServiceConstants.UPLOAD_FIREBASE_SERVICE],
})
export class UploadModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware)
      .forRoutes(
        { path: 'api/posts/upload', method: RequestMethod.POST },
        { path: 'api/posts/upload', method: RequestMethod.PUT },
      );
  }
}
