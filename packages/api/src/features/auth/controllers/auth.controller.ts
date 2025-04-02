import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppConstants } from 'src/common/constants/app.constant';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { LoginStatus } from 'src/common/enums/loginStatus.enum';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { VerifyDto } from '../dto/verify.dto';
import { AuthService } from '../services/auth.service';

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
      return ResponseDto.success('Account registered before. Please verify.');
    }

    // Set up cookie
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    response.cookie('refresh_token', result.refreshToken, {
      maxAge: AppConstants.REFRESH_TOKEN_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: AppConstants.REFRESH_TOKEN_COOKIE_PATH,
    });

    return ResponseDto.success('Login successfully', {
      user: result.user,
    });
  }

  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);

    return ResponseDto.success('Register successfully. Please verify.');
  }

  @Public()
  @Post('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Revoke from database
    const refreshToken = request.cookies?.refresh_token;

    await this.authService.logout(refreshToken);

    // Delete from cookies
    // Must match all options when set up
    response.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    response.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: AppConstants.REFRESH_TOKEN_COOKIE_PATH,
    });

    return ResponseDto.success('Logout successfully.');
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
      maxAge: AppConstants.REFRESH_TOKEN_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/api/auth/refresh',
    });

    return ResponseDto.success('Verify successfully', {
      user: result.user,
    });
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

    return ResponseDto.success('Renew access token successfully');
  }
}
