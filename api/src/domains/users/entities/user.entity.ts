import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Code } from 'src/domains/auth/entities/code.entity';

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
}
