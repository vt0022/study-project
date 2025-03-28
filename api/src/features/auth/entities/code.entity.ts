import { User } from 'src/features/users/entities/user.entity';
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

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @OneToOne(() => User, (user) => user.code)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
