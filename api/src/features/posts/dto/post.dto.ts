import { Expose } from 'class-transformer';
import { LeanUserDto } from 'src/features/users/dto/leanUser.dto';

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt?: Date;

  @Expose()
  views: number = 0;

  @Expose()
  isPrivate: boolean;

  @Expose()
  totalLikes: number = 0;

  @Expose()
  totalComments: number = 0;

  @Expose()
  imageUrl?: string;

  @Expose()
  thumbnailUrl?: string;

  @Expose()
  user: LeanUserDto;
}
