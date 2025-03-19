import {
  Body,
  Controller,
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
    const imageUrl = await this.uploadSupabaseService.uploadFile(file);
    return { url: imageUrl };
  }

  @Post('/')
  async createPost(
    @CurrentUser('id') userId: number,
    @Body() postAddDto: PostAddDto,
  ) {
    await this.postService.createPost(userId, postAddDto);
  }
}
