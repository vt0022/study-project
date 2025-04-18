import { Injectable } from '@nestjs/common';
import path from 'path';
import sharp from 'sharp';
import { Readable } from 'stream';

@Injectable()
export class ThumbnailService {
  async generateThumbnail(
    file: Readable,
    fileName: string,
  ): Promise<Express.Multer.File> {
    const resizer = sharp()
      .resize(400, 300, { fit: 'cover' })
      .jpeg({ quality: 80 });

    const buffer = await this.convertStreamToBuffer(file.pipe(resizer));

    const fileNameWithoutExt = path.parse(fileName).name;

    return {
      fieldname: 'thumbnail',
      originalname: fileNameWithoutExt + '-thumbnail' + '.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: buffer,
      size: buffer.length,
      destination: '',
      filename: fileNameWithoutExt + '-thumbnail' + '.jpg',
      path: '',
    } as Express.Multer.File;
  }

  async convertStreamToBuffer(file: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', () => resolve(Buffer.concat(chunks)));
      file.on('error', reject);
    });
  }
}
