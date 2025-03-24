import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../entities/refreshToken.entity';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/features/users/entities/user.entity';
import { RefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RefreshTokenService {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findRefreshTokenById(id);
  }

  async deleteRefreshTokenById(id: string): Promise<void> {
    await this.refreshTokenRepository.deleteRefreshTokenById(id);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const jti = uuidv4(); // Use uuid
    const payload: RefreshTokenPayload = { sub: user.id, jti: jti };
    const refreshTokenValue = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    // Store jti as token id for searching
    let refreshToken = new RefreshToken();
    refreshToken.id = jti;
    // Hash refresh token before saving
    refreshToken.value = this.encryptRefreshToken(refreshTokenValue);
    refreshToken.user = user;
    refreshToken =
      await this.refreshTokenRepository.saveRefreshToken(refreshToken);
    return refreshTokenValue;
  }

  private encryptRefreshToken(refreshToken: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(refreshToken, salt);
    return hash;
  }
}
