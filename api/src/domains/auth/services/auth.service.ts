import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginStatus } from 'src/common/enums/loginStatus.enum';
import { EmailService } from 'src/domains/email/email.service';
import { UserAddDto } from 'src/domains/users/dto/userAdd.dto';
import { UserProfileDto } from 'src/domains/users/dto/userProfile.dto';
import { User } from 'src/domains/users/entities/user.entity';
import { UserService } from 'src/domains/users/services/user.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { VerifyDto } from '../dto/verify.dto';
import { AccessTokenPayload } from '../interfaces/accessTokenPayload.interface';
import { RefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';
import { CodeService } from './code.service';
import { RefreshTokenService } from './refreshToken.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private accessTokenExpAt: string;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private codeService: CodeService,
    private emailService: EmailService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
  ) {
    this.accessTokenExpAt = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRES_IN',
    );
  }

  async login(loginDto: LoginDto): Promise<{
    status: string;
    accessToken?: string;
    refreshToken?: string;
    user?: UserProfileDto;
  }> {
    const user = await this.userService.findUser(
      loginDto.email,
      loginDto.password,
    );

    if (user.isVerified === false) {
      const code = await this.codeService.findCodeByUser(user);
      this.emailService.sendEmail(
        user.email,
        'Verify your email',
        'register',
        code,
      );
      return { status: LoginStatus.NotVerified };
    }

    const accessToken = await this.generateToken(true, user);
    const refreshToken = await this.generateToken(false, user);

    const userProfileDto = new UserProfileDto();
    userProfileDto.id = user.id;
    userProfileDto.email = user.email;
    userProfileDto.firstName = user.firstName;
    userProfileDto.lastName = user.lastName;
    userProfileDto.role = user.role;

    return {
      status: LoginStatus.Success,
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userProfileDto,
    };
  }

  async register(registerDto: RegisterDto): Promise<void> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userService.findUserByEmail(registerDto.email);

    if (user) {
      throw new BadRequestException('Email already exists');
    } else {
      const userDto: UserAddDto = {
        email: registerDto.email,
        password: registerDto.password,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      const newUser = await this.userService.createUser(userDto, 'user');

      if (newUser) {
        // User registered successfully and please verify
        const code = await this.codeService.findCodeByUser(newUser);

        this.emailService.sendEmail(
          newUser.email,
          'Verify your email',
          'register',
          code,
        );
      } else {
        throw new BadRequestException('Register failed');
      }
    }
  }

  async verify(verifyDto: VerifyDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserProfileDto;
  }> {
    const user = await this.codeService.verifyCode(
      verifyDto.email,
      verifyDto.code,
    );

    const accessToken = await this.generateToken(true, user);
    const refreshToken = await this.generateToken(false, user);

    const userProfileDto = new UserProfileDto();
    userProfileDto.id = user.id;
    userProfileDto.email = user.email;
    userProfileDto.firstName = user.firstName;
    userProfileDto.lastName = user.lastName;
    userProfileDto.role = user.role;

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userProfileDto,
    };
  }

  async generateNewAccesstoken(
    refreshTokenValue: string | null,
  ): Promise<string> {
    if (!refreshTokenValue) {
      throw new BadRequestException('No refresh token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshTokenValue,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      // Find
      const refreshToken = await this.refreshTokenService.findRefreshTokenById(
        payload.jti,
      );

      if (!refreshToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      // Compare refresh token
      // Incase change in db
      const isMatch = await bcrypt.compare(
        refreshTokenValue,
        refreshToken.value,
      );

      // Token from cookie not match with token in db
      if (!isMatch) {
        throw new BadRequestException('Invalid refresh token');
      }

      // Get user
      const user = await this.userService.findUserById(payload.sub);

      if (!user) {
        throw new BadRequestException('Invalid refresh token');
      }

      // Create new access token
      const accessTokenPayload: AccessTokenPayload = {
        sub: user.id,
        email: user.email,
        role: user?.role.name,
      };

      const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      });
      return accessToken;
    } catch {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async logout(refreshTokenValue: string): Promise<void> {
    if (refreshTokenValue) {
      const payload =
        this.jwtService.decode<RefreshTokenPayload>(refreshTokenValue);

      // Find
      const refreshToken = await this.refreshTokenService.findRefreshTokenById(
        payload.jti,
      );

      if (!refreshToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      // Compare refresh token
      // Incase change in db
      const isMatch = await bcrypt.compare(
        refreshTokenValue,
        refreshToken.value,
      );

      // Token from cookie not match with token in db
      if (!isMatch) {
        throw new BadRequestException('Invalid refresh token');
      }

      await this.refreshTokenService.deleteRefreshTokenById(payload.jti);
    }
  }

  private async generateToken(isAccess: boolean, user: User): Promise<string> {
    // Access token
    if (isAccess) {
      const payload: AccessTokenPayload = {
        sub: user.id,
        email: user.email,
        role: user?.role.name,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: this.accessTokenExpAt,
      });
      return accessToken;
    } else {
      // Refresh token
      const refreshToken =
        await this.refreshTokenService.generateRefreshToken(user);
      return refreshToken;
    }
  }
}
