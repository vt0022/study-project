import { Injectable } from '@nestjs/common';
import { IUploadService } from './upload.service';
import { decode } from 'base64-arraybuffer';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadSupabaseService implements IUploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // const fileBase64 = decode(file.buffer.toString('base64'));
    const { data, error } = await createClient(
      this.configService.get<string>('SUPABASE_PROJECT_URL'),
      this.configService.get<string>('SUPABASE_ANON_KEY'),
    )
      .storage.from('post-image')
      .upload(file.originalname, file.buffer, { contentType: 'image/png' });

    if (error) {
      throw error;
    }

    // Get public url
    const { data: image } = createClient(
      this.configService.get<string>('SUPABASE_PROJECT_URL'),
      this.configService.get<string>('SUPABASE_ANON_KEY'),
    )
      .storage.from('post-image')
      .getPublicUrl(data.path);

    return image.publicUrl;
  }
}
