import { User } from 'src/domains/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  isPrivate: boolean;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
