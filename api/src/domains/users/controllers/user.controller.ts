import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserAddDto } from '../dto/userAdd.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  createUser(@Body() userAddDto: UserAddDto) {
    return this.userService.createUser(userAddDto, 'user');
  }
}

