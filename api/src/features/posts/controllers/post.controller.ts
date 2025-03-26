import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFile
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ResponseStatus } from 'src/common/enums/responseStatus.enum';
import { UploadFirebaseService } from 'src/features/upload/uploadFirebase.service';
import { PostAddDto } from '../dto/addPost.dto';
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
    @CurrentUser('sub') userId: number,
    @Body() postAddDto: PostAddDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.postService.createPost(userId, postAddDto, file);
  }

  @ApiOperation({ summary: 'Get posts for news feed' })
  @Get('/hi')
  async getPostForNewsFeed(@CurrentUser('sub') userId: number) {
    const postDtoList = await this.postService.getPostsForUser(userId);

    return new ResponseDto(
      ResponseStatus.Success,
      HttpStatus.OK,
      'Get posts for user.',
      postDtoList,
    );
  }
}
