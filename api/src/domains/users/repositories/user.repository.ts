import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository.target, userRepository.manager);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.findOne({ where: { id: id } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.findOne({
      where: { email: email },
      relations: {
        role: true,
      },
    });
  }

  async saveUser(user: User): Promise<User> {
    return await this.save(user);
  }
}
