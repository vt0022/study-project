import { BaseEntity } from 'src/common/entities/base.entities';
import { User } from 'src/features/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Post extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  views: number;

  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
