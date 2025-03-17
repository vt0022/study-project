import { Injectable, NestMiddleware } from '@nestjs/common';
import multer from 'multer';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
  });

  use(request: any, response: any, next: () => void) {
    this.upload.single('file')(request, response, next);
  }
}
