import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserDto } from '../dto/userDto.dto';

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
      throw new UnauthorizedException("Wrong email");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return user;
    } else {
      throw new UnauthorizedException("Wrong password");
    }
  }

  async createUser(userDto: UserDto
  ): Promise<User> {
    const userRole = await this.roleRepository.findOneBy({ name: userDto.role });

    const newUser = new User();
    newUser.email = userDto.email;
    newUser.password = this.encryptPassWord(userDto.password);
    newUser.firstName = userDto.firstName;
    newUser.lastName = userDto.lastName;
    newUser.role = userRole;
    return this.userRepository.save(newUser);
  }

  encryptPassWord(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
}
