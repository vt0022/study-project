import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Code } from 'src/features/auth/entities/code.entity';
import { Post } from 'src/features/posts/entities/post.entity';
import { Follower } from './follower.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToOne(() => Code, (code) => code.user)
  code: Code;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // One user is being followed by other users
  @OneToMany(() => Follower, (follower) => follower.followedUser)
  followers: Follower[];

  // One user follows other users
  @OneToMany(() => Follower, (follower) => follower.followingUser)
  followings: Follower[];
}
