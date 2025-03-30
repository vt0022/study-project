import { EntityManager, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    super(Role, entityManager);
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return await this.findOne({
      where: {
        name: name,
      },
    });
  }
}
