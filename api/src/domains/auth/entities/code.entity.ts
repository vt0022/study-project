import { User } from 'src/domains/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('code')
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
  })
  expiredAt: Date;

  @Column({ default: false })
  isExpired: boolean;

  @OneToOne(() => User, (user) => user.code)
  @JoinColumn()
  user: User;
}
