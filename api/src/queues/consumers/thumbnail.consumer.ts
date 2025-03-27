import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PostService } from 'src/features/posts/services/post.service';
import { UploadFirebaseService } from 'src/features/upload/uploadFirebase.service';
import { ThumbnailService } from '../services/thumbnail.service';

@Processor('thumbnail')
export class ThumbnailConsumer extends WorkerHost {
  constructor(
    private uploadFirebaseService: UploadFirebaseService,
    private postService: PostService,
    private thumbnailService: ThumbnailService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'generate_thumbnail': {
        try {
          // Download file
          const stream = await this.uploadFirebaseService.downloadFile(
            job.data.fileUrl,
          );
          job.updateProgress(20);

          // Generate thumbnail
          const thumbnail = await this.thumbnailService.generateThumbnail(
            stream.file,
            stream.fileName,
          );
          job.updateProgress(50);

          // Upload thumbnail
          const thumbnailUrl =
            await this.uploadFirebaseService.uploadFile(thumbnail);
          job.updateProgress(80);

          await this.postService.updateThumbnail(job.data.postId, thumbnailUrl);
          job.updateProgress(100);
        } catch {
          console.log('Error generating thumbnail for post');
        }
        return {};
      }
      case 'remove_thumbnail': {
        try {
          await this.uploadFirebaseService.deleteFile(job.data.imageUrl);
          await this.uploadFirebaseService.deleteFile(job.data.imageUrl);
        } catch {
          console.log('Error removing old image and thumbnail for post');
        }
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

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`Failed processing job ${job.id}:`, error.message);
  }
}
