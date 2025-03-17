import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
import * as FirebaseServiceAccount from './../../../firebase-service-account.json';

@Injectable()
export class UploadService {
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
