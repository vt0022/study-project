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
import { RefreshToken } from 'src/features/auth/entities/refreshToken.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToOne(() => Code, (code) => code.user)
  code: Code;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
