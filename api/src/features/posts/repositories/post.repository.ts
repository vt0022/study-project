import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

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

  async findPostsForUser(userId: number): Promise<Post[]> {
    // Find posts that:
    // - are not private
    // - belong to users that current user are following
    // User -> followings -> users
    // const postList = this.createQueryBuilder()
    //   .select(['post'])
    //   .innerJoinAndSelect('user.followings', 'following') // Get followings of user
    //   .innerJoinAndSelect('following.posts', 'post') // Get post of following
    //   .where('user.id = :id', { id: userId })
    //   .andWhere('post.isPrivate = false')
    //   .getMany();

    const postList = await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'author') // Get author of post -> each post with author
      .innerJoin('author.followers', 'follower') // Get followings of author ->
      .where('follower.followingUser.id = :id', { id: userId })
      .andWhere('post.isPrivate = false')
      .getMany();

    return postList;
  }
}
