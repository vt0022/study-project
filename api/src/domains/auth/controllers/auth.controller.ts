import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/LoginDto.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("users")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get('/test/admin')
  testAdmin(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles('user')
  @Get('/test/user')
  testUser(@Request() req) {
    return req.user;
  }
}
