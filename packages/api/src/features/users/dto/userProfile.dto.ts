import { Role } from '../entities/role.entity';

export class UserProfileDto {
  id: number;

  email: string;

  firstName: string;

  lastName: string;

  role: Role;
}
