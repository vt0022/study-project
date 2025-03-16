import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domains/users/services/user.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserAddDto } from 'src/domains/users/dto/userAdd.dto';
import { EmailService } from 'src/domains/email/email.service';
import { CodeService } from './code.service';
import { VerifyDto } from '../dto/verify.dto';
import { RegisterStatus } from 'src/common/enums/registerStatus.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private codeService: CodeService,
    private emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.findUser(
      loginDto.email,
      loginDto.password,
    );

    const payload = { sub: user.id, username: user.email };
    return await this.jwtService.signAsync(payload);
  }

  async register(registerDto: RegisterDto): Promise<RegisterStatus> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userService.findUserByEmail(registerDto.email);

    if (user) {
      if (user.isVerified) {
        throw new BadRequestException('Email already exists');
      } else {
        const code = await this.codeService.findCodeByUser(user);
        this.emailService.sendEmail(
          user.email,
          'Verify your email',
          'register',
          code,
        );
        return RegisterStatus.NOT_VERIFIED;
      }
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

        return RegisterStatus.SUCCESS;
      } else {
        throw new BadRequestException('Register failed');
      }
    }
  }

  async verify(verifyDto: VerifyDto): Promise<void> {
    await this.codeService.verifyCode(verifyDto.email, verifyDto.code);
  }
}
