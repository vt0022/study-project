import { Expose } from 'class-transformer';
import { LeanUserDto } from 'src/features/users/dto/leanUser.dto';

export class CommentDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  content: string;

  @Expose()
  user: LeanUserDto;

  @Expose()
  childComments: CommentDto[];
}
