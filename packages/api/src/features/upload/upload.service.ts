import { Readable } from 'stream';

export interface IUploadService {
  uploadFile(file: Express.Multer.File): Promise<string>;

  downloadFile(fileUrl: string): Promise<{ file: Readable; fileName: string }>;

  deleteFile(fileUrl: string): Promise<void>;
}
