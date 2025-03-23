import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('thumbnail')
export class ThumbnailConsumer extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    let progress = 0;
    for (let i = 0; i < 100; i++) {
      await solve(job.data);
      progress++;
      await job.updateProgress(progress);
    }

    return {};
  }
}
