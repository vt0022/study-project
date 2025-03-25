import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  followedAt: Date;

  @ManyToOne(() => User, (user) => user.followers) // Users that follow a user
  @JoinColumn({ name: 'followed_id' })
  followedUser: User;

  @ManyToOne(() => User, (user) => user.followings) // Users that a user follows
  @JoinColumn({ name: 'following_id' })
  followingUser: User;
}
