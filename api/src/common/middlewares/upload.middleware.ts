import { Injectable, NestMiddleware } from '@nestjs/common';
import multer from 'multer';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });

  use(request: any, response: any, next: () => void) {
    this.upload.single('file')(request, response, next);
  }
}
