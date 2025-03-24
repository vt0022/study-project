import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import multer, { FileFilterCallback } from 'multer';
import { Constants } from '../constants/constant';
import path from 'path';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: Constants.MAX_FILE_SIZE,
    },
    fileFilter: (request, file, cb) => {
      this.checkFileType(file, cb);
    },
  });

  use(request: any, response: any, next: (error?: any) => void) {
    this.upload.single('file')(request, response, (error: any) => {
      if (error) {
        return next(new BadRequestException(error.message));
      }

      next();
    });
  }

  checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|bmp|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type! Only jpeg, jpg, png, bmp and webp are allowed.',
        ),
      );
    }
  }
}
