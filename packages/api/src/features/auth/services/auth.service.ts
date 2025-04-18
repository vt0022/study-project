import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginStatus } from 'src/common/enums/loginStatus.enum';
import { EmailService } from 'src/features/email/email.service';
import { UserAddDto } from 'src/features/users/dto/addUser.dto';
import { UserProfileDto } from 'src/features/users/dto/userProfile.dto';
import { User } from 'src/features/users/entities/user.entity';
import { UserService } from 'src/features/users/services/user.service';
import { RedisService } from '../../../caches/redis.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { VerifyDto } from '../dto/verify.dto';
import { AccessTokenPayload } from '../interfaces/accessTokenPayload.interface';
import { RefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';
import { CodeService } from './code.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private accessTokenExpAt: string;
  private refreshTokenExpAt: string;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private codeService: CodeService,
    private emailService: EmailService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    this.accessTokenExpAt = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRES_IN',
    );
    this.refreshTokenExpAt = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
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

    // Add to active list
    const payload =
      await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken);
    this.redisService.setTokenIntoActiveList(
      user.id,
      payload.jti,
      refreshToken,
      payload.iat,
      payload.exp,
    );

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

    // Add to active list
    const payload =
      await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken);
    this.redisService.setTokenIntoActiveList(
      user.id,
      payload.jti,
      refreshToken,
      payload.iat,
      payload.exp,
    );

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

  async generateNewAccesstoken(refreshToken: string | null): Promise<string> {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token');
    }

    try {
      // Verify
      const payload =
        await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken);

      // Check refresh token in black list
      const isBanned = await this.redisService.checkTokenInBlackList(
        payload.jti,
      );

      if (isBanned) {
        throw new BadRequestException('Invalid refresh token1');
      }

      // Get user
      const user = await this.userService.findUserById(payload.sub);

      if (!user) {
        throw new BadRequestException('Invalid refresh token2');
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
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid refresh token3');
    }
  }

  async logout(refreshToken: string | null): Promise<void> {
    if (refreshToken) {
      // Verify
      try {
        const payload =
          await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken);

        // Put refresh token in black list
        this.redisService.setTokenIntoBlackList(
          payload.jti,
          refreshToken,
          payload.iat,
          payload.exp,
        );

        // Remove refresh token in active list
        this.redisService.delTokenFromActiveList(payload.sub, payload.jti);
      } catch {
        throw new BadRequestException('Invalid refresh token');
      }
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
      const jti = uuidv4();
      const payload: RefreshTokenPayload = {
        sub: user.id,
        jti: jti,
      };
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: this.refreshTokenExpAt,
      });
      return refreshToken;
    }
  }
}
