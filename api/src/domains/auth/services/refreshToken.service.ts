import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../entities/refreshToken.entity';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/domains/users/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateRefreshToken(user: User): Promise<string> {
    const jti = '111111'; // Use uuid
    const payload = { sub: user.id, jti: jti };
    const refreshTokenValue = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    // Store jti as token id for searching
    let refreshToken = new RefreshToken();
    refreshToken.id = jti;
    refreshToken.value = refreshTokenValue;
    refreshToken.user = user;
    refreshToken =
      await this.refreshTokenRepository.saveRefreshToken(refreshToken);
    return refreshToken.value;
  }
}
