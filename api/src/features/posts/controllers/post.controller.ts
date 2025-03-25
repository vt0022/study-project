import { Body, Controller, Get, Post, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import path from 'path';
import sharp from 'sharp';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { UploadFirebaseService } from 'src/features/upload/uploadFirebase.service';
import { Readable } from 'stream';
import { PostAddDto } from '../dto/postAdd.dto';
import { PostService } from '../services/post.service';

@Controller('posts')
export class PostController {
  constructor(
    private uploadFirebaseService: UploadFirebaseService,
    private postService: PostService,
  ) {}

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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadFirebaseService.uploadFile(file);
    const result = await this.uploadFirebaseService.downloadFile(imageUrl);
    const thumbnail = await this.generateThumbnail(
      result.file,
      result.fileName,
    );
    const thumbnailUrl = await this.uploadFirebaseService.uploadFile(thumbnail);
    return { name: result.fileName, url: thumbnailUrl };
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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        content: {
          type: 'string',
          example: '{"content": ""}',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create new post' })
  @Post('/')
  async createPost(
    @CurrentUser('id') userId: number,
    @Body() postAddDto: PostAddDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.postService.createPost(userId, postAddDto, file);
  }

  @Get('/test')
  @Roles('user')
  async testPost() {
    return { message: 'Hi' };
  }
}
