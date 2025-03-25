import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import path from 'path';
import sharp from 'sharp';
import { PostService } from 'src/features/posts/services/post.service';
import { Readable } from 'stream';
import { UploadFirebaseService } from '../../upload/uploadFirebase.service';

@Processor('thumbnail')
export class ThumbnailConsumer extends WorkerHost {
  constructor(
    private uploadFirebaseService: UploadFirebaseService,
    private postService: PostService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'thumbnail': {
        // Download file
        const stream = await this.uploadFirebaseService.downloadFile(
          job.data.fileUrl,
        );
        job.updateProgress(20);

        // Generate thumbnail
        const thumbnail = await this.generateThumbnail(
          stream.file,
          stream.fileName,
        );
        job.updateProgress(50);

        // Upload thumbnail
        const thumbnailUrl =
          await this.uploadFirebaseService.uploadFile(thumbnail);
        job.updateProgress(80);

        // Save thumbnail
        await this.postService.updateThumbnail(job.data.postId, thumbnailUrl);
        job.updateProgress(100);

        return {};
      }
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Processing job ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Completed job ${job.id}`);
  }

  @OnWorkerEvent('error')
  onError(job: Job, error: Error) {
    console.error(`Error processing job ${job.id}:`, error.message);
  }

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
      originalname: fileNameWithoutExt + '-thumbnail',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: buffer,
      size: buffer.length,
      destination: '',
      filename: fileNameWithoutExt + '-thumbnail',
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
