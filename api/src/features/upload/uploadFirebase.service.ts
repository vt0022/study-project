import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin, { ServiceAccount } from 'firebase-admin';
import path from 'path';
import { Readable } from 'stream';
import * as FirebaseServiceAccount from '../../../firebase-service-account.json';
import { IUploadService } from './upload.service';

@Injectable()
export class UploadFirebaseService implements IUploadService {
  constructor(private configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert(<ServiceAccount>FirebaseServiceAccount),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = admin.storage().bucket();

    // Generate file name
    const fileNameWithoutExt = path.parse(file.originalname).name;
    const uniqueSuffix = Date.now() + path.extname(file.originalname);

    const blob = bucket.file(fileNameWithoutExt + '-' + uniqueSuffix);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => reject(error));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  async downloadFile(
    fileUrl: string,
  ): Promise<{ file: Readable; fileName: string }> {
    const bucket = admin.storage().bucket();

    // Get file name
    const fileName = fileUrl.split('/').pop();

    const blob = bucket.file(fileName);
    const blobStream = blob.createReadStream();

    return { file: blobStream, fileName: fileName };
  }
}
