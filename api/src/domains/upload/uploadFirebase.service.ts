import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
import * as FirebaseServiceAccount from '../../../firebase-service-account.json';
import { IUploadService } from './i.upload.service';

@Injectable()
export class UploadFirebaseService implements IUploadService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(<ServiceAccount>FirebaseServiceAccount),
      storageBucket: process.env.STORAGE_BUCKET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = admin.storage().bucket();
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({ resumable: false });

    console.log(process.env.STORAGE_BUCKET);

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
