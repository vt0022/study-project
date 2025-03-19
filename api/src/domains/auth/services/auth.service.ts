import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domains/users/services/user.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserAddDto } from 'src/domains/users/dto/userAdd.dto';
import { EmailService } from 'src/domains/email/email.service';
import { CodeService } from './code.service';
import { VerifyDto } from '../dto/verify.dto';
import { LoginStatus } from 'src/common/enums/loginStatus.enum';
import { config } from 'dotenv';
import { validate } from 'src/common/validators/env.validator';
import { User } from 'src/domains/users/entities/user.entity';
import { UserProfileDto } from 'src/domains/users/dto/userProfile.dto';

config();

const validatedConfig = validate(process.env);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private codeService: CodeService,
    private emailService: EmailService,
  ) {}

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

  private async generateToken(isAccess: boolean, user: User): Promise<string> {
    // Access token
    if (isAccess) {
      const payload = {
        sub: user.id,
        email: user.email,
        role: user?.role.name,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: validatedConfig.ACCESS_TOKEN_EXPIRES_IN,
      });
      return accessToken;
    } else {
      // Refresh token
      const payload = { sub: user.id };
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: validatedConfig.REFRESH_TOKEN_EXPIRES_IN,
      });
      return refreshToken;
    }
  }
}
