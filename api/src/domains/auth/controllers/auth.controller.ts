import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';
import { RegisterDto } from '../dto/register.dto';
import { VerifyDto } from '../dto/verify.dto';
import { RegisterStatus } from 'src/common/enums/registerStatus.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const accessToken = await this.authService.login(loginDto);
    return new ResponseDto<{ accessToken: string }>(
      'success',
      HttpStatus.OK,
      'Login successfully',
      {
        accessToken,
      },
    );
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const registerStatus = await this.authService.register(registerDto);

    if (registerStatus === RegisterStatus.NOT_VERIFIED) {
      return new ResponseDto(
        'success',
        HttpStatus.OK,
        'Account registered before. Please verify.',
      );
    }

    return new ResponseDto(
      'success',
      HttpStatus.OK,
      'Register successfully. Please verify.',
    );
  }

  @Post('/verify')
  async verify(@Body() verifyDto: VerifyDto) {
    await this.authService.verify(verifyDto);

    return new ResponseDto('success', HttpStatus.OK, 'Verify successfully');
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
