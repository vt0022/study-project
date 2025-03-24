import { User } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    super(User, entityManager);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.findOne({
      where: { id: id },
      relations: {
        role: true,
      },
    });
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
