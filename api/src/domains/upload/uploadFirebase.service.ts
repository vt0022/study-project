import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin, { ServiceAccount } from 'firebase-admin';
import * as FirebaseServiceAccount from '../../../firebase-service-account.json';
import { IUploadService } from './upload.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

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

  // Add job to queue
  async addJob(file: Express.Multer.File) {
    const job = await this.thumbnailQueue.add('thumbnail', {
      filePath: file.path,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = admin.storage().bucket();
    const blob = bucket.file(file.originalname);
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
}
