import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserAddDto } from '../dto/userAdd.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Wrong email');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return user;
    } else {
      throw new UnauthorizedException('Wrong password');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      email: email,
    });
  }

  async createUser(userAddDto: UserAddDto, role: string): Promise<User> {
    const userRole = await this.roleRepository.findOneBy({
      name: role,
    });

    if (!userRole) {
      throw new NotFoundException(`Role '${role}' not found`);
    }

    const newUser = new User();
    newUser.email = userAddDto.email;
    newUser.password = this.encryptPassWord(userAddDto.password);
    newUser.firstName = userAddDto.firstName;
    newUser.lastName = userAddDto.lastName;
    newUser.role = userRole;
    return this.userRepository.save(newUser);
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  encryptPassWord(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
}
