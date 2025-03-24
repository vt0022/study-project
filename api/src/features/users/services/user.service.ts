import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { UserAddDto } from '../dto/userAdd.dto';
import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  async findUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('Wrong email');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return user;
    } else {
      throw new BadRequestException('Wrong password');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUserByEmail(email);
  }

  async createUser(userAddDto: UserAddDto, role: string): Promise<User> {
    const userRole = await this.roleRepository.findRoleByName(role);

    if (!userRole) {
      throw new NotFoundException(`Role '${role}' not found`);
    }

    const newUser = new User();
    newUser.email = userAddDto.email;
    newUser.password = this.encryptPassWord(userAddDto.password);
    newUser.firstName = userAddDto.firstName;
    newUser.lastName = userAddDto.lastName;
    newUser.role = userRole;
    return this.userRepository.saveUser(newUser);
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.saveUser(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findUserById(id);
  }

  private encryptPassWord(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
}
