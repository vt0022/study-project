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

  @Column({
    type: 'timestamp',
  })
  expiredAt: Date;

  @Column({ default: false })
  isUsed: boolean;

  @OneToOne(() => User, (user) => user.code)
  @JoinColumn()
  user: User;
}
