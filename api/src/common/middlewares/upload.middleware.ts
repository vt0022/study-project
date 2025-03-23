import { Injectable, NestMiddleware } from '@nestjs/common';
import multer from 'multer';
import { Constants } from '../constants/constant';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: Constants.MAX_FILE_SIZE,
    },
  });

  use(request: any, response: any, next: () => void) {
    this.upload.single('file')(request, response, next);
  }
}
