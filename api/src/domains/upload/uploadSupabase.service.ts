import { Injectable } from '@nestjs/common';
import { IUploadService } from './i.upload.service';
import { decode } from 'base64-arraybuffer';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadSupabaseService implements IUploadService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileBase64 = decode(file.buffer.toString('base64'));
    const { data, error } = await createClient(
      process.env.SUPABASE_PROJECT_URL,
      process.env.SUPABASE_ANON_KEY,
    )
      .storage.from('post-image')
      .upload(file.originalname, file.buffer, { contentType: 'image/png' });

    if (error) {
      throw error;
    }

    // Get public url
    const { data: image } = createClient(
      process.env.SUPABASE_PROJECT_URL,
      process.env.SUPABASE_ANON_KEY,
    )
      .storage.from('post-image')
      .getPublicUrl(data.path);

    return image.publicUrl;
  }
}
