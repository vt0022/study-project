import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super(roleRepository.target, roleRepository.manager);
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return await this.findOne({
      where: {
        name: name,
      },
    });
  }
}
