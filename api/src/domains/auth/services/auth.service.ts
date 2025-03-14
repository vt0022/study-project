import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/domains/users/services/user.service';
import { LoginDto } from '../dto/LoginDto.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto:LoginDto
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findUser(loginDto.email, loginDto.password);

    if (user) {
      const payload = { sub: user.id, username: user.email };
      return { accessToken: await this.jwtService.signAsync(payload) };
    } else {
      throw new UnauthorizedException();
    }
  }
}
