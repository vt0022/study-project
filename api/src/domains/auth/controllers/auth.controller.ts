import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { RegisterDto } from '../dto/register.dto';
import { VerifyDto } from '../dto/verify.dto';
import { LoginStatus } from 'src/common/enums/loginStatus.enum';
import { Response } from 'express';
import { ResponseStatus } from 'src/common/enums/responseStatus.enum';
import { UserProfileDto } from 'src/domains/users/dto/userProfile.dto';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Not verified then must verify
    if (result.status === LoginStatus.NotVerified) {
      return new ResponseDto(
        ResponseStatus.Success,
        HttpStatus.OK,
        'Account registered before. Please verify.',
      );
    }

    // Set up cookie
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'none',
    });
    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      path: '/api/auth/refresh',
    });

    return new ResponseDto<{ user: UserProfileDto }>(
      ResponseStatus.Success,
      HttpStatus.OK,
      'Login successfully',
      {
        user: result.user,
      },
    );
  }

  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);

    return new ResponseDto(
      ResponseStatus.Success,
      HttpStatus.OK,
      'Register successfully. Please verify.',
    );
  }

  @Public()
  @Post('/verify')
  async verify(
    @Body() verifyDto: VerifyDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.verify(verifyDto);

    // Set up cookie
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'none',
    });
    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      path: '/api/auth/refresh',
    });

    return new ResponseDto<{ user: UserProfileDto }>(
      ResponseStatus.Success,
      HttpStatus.OK,
      'Verify successfully',
      {
        user: result.user,
      },
    );
  }

  @Public()
  @Get('/test/public')
  testPublic() {
    return { message: 'This is public' };
  }

  @ApiCookieAuth()
  @Roles('admin')
  @Get('/test/admin')
  testAdmin(@Request() req) {
    return req.user;
  }

  @ApiCookieAuth()
  @Roles('user')
  @Get('/test/user')
  testUser(@Request() req) {
    return req.user;
  }
}
