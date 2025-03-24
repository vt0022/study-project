export interface IUploadService {
  uploadFile(file: Express.Multer.File): Promise<string>;
}
