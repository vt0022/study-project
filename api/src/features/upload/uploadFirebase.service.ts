import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin, { ServiceAccount } from 'firebase-admin';
import * as FirebaseServiceAccount from '../../../firebase-service-account.json';
import { IUploadService } from './upload.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import path from 'path';

@Injectable()
export class UploadFirebaseService implements IUploadService {
  constructor(
    @InjectQueue('thumbnail')
    private thumbnailQueue: Queue,
    private configService: ConfigService,
  ) {
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

  async upload(fileUrl: string): Promise<any> {
    await this.thumbnailQueue.add('thumbnail', {
      fileUrl: fileUrl,
    });
  }
}
