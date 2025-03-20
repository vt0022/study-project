import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { RegisterDto } from '../dto/register.dto';
import { VerifyDto } from '../dto/verify.dto';
import { LoginStatus } from 'src/common/enums/loginStatus.enum';
import { Request, Response } from 'express';
import { ResponseStatus } from 'src/common/enums/responseStatus.enum';
import { UserProfileDto } from 'src/domains/users/dto/userProfile.dto';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

const REFRESH_TOKEN_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

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
      secure: true,
    });

    response.cookie('refresh_token', result.refreshToken, {
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
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
      secure: true,
    });

    response.cookie('refresh_token', result.refreshToken, {
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
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
  @Post('/refresh')
  async refresh(
    @Req() request: Request & { cookies: any },
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;

    const accessToken =
      await this.authService.generateNewAccesstoken(refreshToken);

    // Set up cookie
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return new ResponseDto<{ accessToken: string }>(
      ResponseStatus.Success,
      HttpStatus.OK,
      'Renew access token successfully',
    );
  }
}
