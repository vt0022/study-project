import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PaginationOptions } from 'src/common/pagination/pagination.option';
import { SortOptions } from 'src/common/enums/sortOption.enum';
import { PaginationMetaData } from 'src/common/pagination/pagination.metadata';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    super(Post, entityManager);
  }

  async findPostById(id: number): Promise<Post | null> {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  }

  async savePost(post: Post): Promise<Post> {
    return await this.save(post);
  }

  async deletePostById(id: number): Promise<void> {
    await this.delete(id);
  }

  async findDetailPost(id: number): Promise<Post> {
    return await this.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
      },
    });
  }

  async findPostsForUser(
    userId: number,
    paginationOptions: PaginationOptions,
  ): Promise<any> {
    // Find posts that:
    // - are not private
    // - belong to users that current user are following

    const postQuery = this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'author') // Get author of post -> each post with author
      .innerJoin('author.followers', 'follower') // Get followings of author ->
      .where('follower.followingUser.id = :id', { id: userId }) // Compare with following Id
      .andWhere('post.isPrivate = false')
      .orderBy('post.createdAt', SortOptions.Desc)
      .skip((paginationOptions.page - 1) * paginationOptions.size)
      .take(paginationOptions.size);

    const totalItems = await postQuery.getCount();
    const totalPages = Math.ceil(totalItems / paginationOptions.size);

    const paginationMetaData: PaginationMetaData = {
      page: paginationOptions.page,
      size: paginationOptions.size,
      totalPages: totalPages,
      totalItems: totalItems,
      hasPreviousPage: paginationOptions.page > 1,
      hasNextPage: paginationOptions.page < totalPages,
    };

    const postList = await postQuery.getMany();

    return {
      data: postList,
      metadata: paginationMetaData,
    };
  }

  async findAllPosts(paginationOptions: PaginationOptions): Promise<any> {
    const [postList, count] = await this.findAndCount({
      relations: {
        user: true,
      },
      order: { [paginationOptions.order]: paginationOptions.sort },
      skip: (paginationOptions.page - 1) * paginationOptions.size,
      take: paginationOptions.size,
    });

    const totalPages = Math.ceil(count / paginationOptions.size);

    const paginationMetaData: PaginationMetaData = {
      page: paginationOptions.page,
      size: paginationOptions.size,
      totalPages: totalPages,
      totalItems: count,
      hasPreviousPage: paginationOptions.page > 1,
      hasNextPage: paginationOptions.page < totalPages,
    };

    return {
      data: postList,
      metadata: paginationMetaData,
    };
  }
}
