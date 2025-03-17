import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domains/users/services/user.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserAddDto } from 'src/domains/users/dto/userAdd.dto';
import { EmailService } from 'src/domains/email/email.service';
import { CodeService } from './code.service';
import { VerifyDto } from '../dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private codeService: CodeService,
    private emailService: EmailService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ status: string; accessToken?: string }> {
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
      return { status: 'not_verified' };
    }

    const payload = { sub: user.id, username: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { status: 'success', accessToken: accessToken };
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

  async verify(verifyDto: VerifyDto): Promise<void> {
    await this.codeService.verifyCode(verifyDto.email, verifyDto.code);
  }
}
