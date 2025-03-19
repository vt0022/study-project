import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { UploadFirebaseService } from 'src/domains/upload/uploadFirebase.service';

@Controller('posts')
export class PostController {
  constructor(private uploadFirebaseService: UploadFirebaseService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Public()
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadFirebaseService.uploadFile(file);
    return { url: imageUrl };
  }
}
