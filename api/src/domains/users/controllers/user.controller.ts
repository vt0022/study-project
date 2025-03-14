import {
  Body,
  Controller,
  Post
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dto/userDto.dto';

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {

  }

  @Post('/create')
  createUser(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto)
  }
}
