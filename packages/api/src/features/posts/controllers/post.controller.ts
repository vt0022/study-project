import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { SortOptions } from 'src/common/enums/sortOption.enum';
import { PaginationOptions } from 'src/common/pagination/pagination.option';
import { AddPostDto } from '../dto/addPost.dto';
import { EditPostDto } from '../dto/editPost.dto';
import { PostService } from '../services/post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

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
        },
        isPrivate: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create new post' })
  @Post('/')
  async createPost(
    @CurrentUser('sub') userId: number,
    @Body() addPostDto?: AddPostDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    const detailPostDto = await this.postService.createPost(
      userId,
      addPostDto,
      file,
    );

    return ResponseDto.success('Create post successfully', detailPostDto);
  }

  @ApiOperation({ summary: 'Get posts for news feed' })
  @Get('/home')
  async getPostForNewsFeed(
    @CurrentUser('sub') userId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10,
  ): Promise<ResponseDto<any>> {
    const paginationOptions: PaginationOptions = { page: page, size: size };
    const postDtoList = await this.postService.getPostsForUser(
      userId,
      paginationOptions,
    );

    return ResponseDto.success('Get posts for user successfully', postDtoList);
  }

  @ApiOperation({ summary: "Get current user's post" })
  @Get('/me')
  async getMyPosts(
    @CurrentUser('sub') userId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10,
  ): Promise<ResponseDto<any>> {
    const paginationOptions: PaginationOptions = { page: page, size: size };
    const postDtoList = await this.postService.getPostsOfUser(
      userId,
      paginationOptions,
    );

    return ResponseDto.success(
      'Get posts of current user successfully',
      postDtoList,
    );
  }

  @ApiOperation({ summary: 'Like or unlike post' })
  @Put('/:id/like')
  async likePost(
    @CurrentUser('sub') userId: number,
    @Param('id') postId: number,
  ) {
    const like = await this.postService.likePost(postId, userId);

    return ResponseDto.success(`${like ? 'Like' : 'Unlike'} post successfully`);
  }

  @ApiOperation({ summary: 'Get detail post' })
  @Get('/:id')
  async getDetailPost(@Param('id') id: number): Promise<ResponseDto<any>> {
    const detailPostDto = await this.postService.getDetailPost(id);

    return ResponseDto.success('Get detail post successfully', detailPostDto);
  }

  @ApiQuery({
    name: 'order',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
  })
  @ApiOperation({ summary: 'Get all posts' })
  // @Roles('admin')
  @Get('')
  async getAllPost(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('size', ParseIntPipe) size: number = 10,
    @Query('order') order: string = 'createdAt',
    @Query('sort') sort: string = 'desc',
  ): Promise<ResponseDto<any>> {
    const paginationOptions: PaginationOptions = {
      page: page,
      size: size,
      order: order,
      sort: sort.toUpperCase() as SortOptions,
    };
    const postDtoList = await this.postService.getAllPosts(paginationOptions);

    return ResponseDto.success('Get all post successfully', postDtoList);
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
        },
        isPrivate: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Edit post' })
  @Put('/:id')
  async editPost(
    @Param('id') id: number,
    @Body() editPostDto?: EditPostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const detailPostDto = await this.postService.editPost(
      id,
      editPostDto,
      file,
    );

    return ResponseDto.success('Edit post successfully', detailPostDto);
  }

  @ApiOperation({ summary: 'Delete post' })
  @Roles('admin')
  @Delete('/:id')
  async deletePost(@Param('id') id: number) {
    await this.postService.deletePost(id);

    return ResponseDto.success('Delete post successfully');
  }
}
