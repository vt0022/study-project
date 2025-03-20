import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { UploadFirebaseService } from 'src/domains/upload/uploadFirebase.service';
import { PostAddDto } from '../dto/postAdd.dto';
import { PostService } from '../services/post.service';
import { UploadSupabaseService } from 'src/domains/upload/uploadSupabase.service';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('posts')
export class PostController {
  constructor(
    private uploadFirebaseService: UploadFirebaseService,
    private uploadSupabaseService: UploadSupabaseService,
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadFirebaseService.uploadFile(file);
    return { url: imageUrl };
  }

  @ApiConsumes('multipart/form-data', 'application/json')
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
  @Post('/')
  async createPost(
    @CurrentUser('id') userId: number,
    @Body() postAddDto: PostAddDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.postService.createPost(userId, postAddDto);
  }

  @Get('/test')
  @Roles('user')
  async testPost() {
    return { message: 'Hi' };
  }
}
