import { User } from 'src/domains/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryColumn()
  id: string;

  @Column()
  value: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
