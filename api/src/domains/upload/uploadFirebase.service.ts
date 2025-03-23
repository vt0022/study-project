import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin, { ServiceAccount } from 'firebase-admin';
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
