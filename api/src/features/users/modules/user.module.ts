import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { Role } from '../entities/role.entity';
import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../repositories/role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository],
  exports: [UserService],
})
export class UserModule {}
