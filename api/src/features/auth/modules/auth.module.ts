import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/features/email/email.module';
import { CacheModule } from 'src/caches/cache.module';
import { UserModule } from 'src/features/users/modules/user.module';
import { AuthController } from '../controllers/auth.controller';
import { Code } from '../entities/code.entity';
import { RefreshToken } from '../entities/refreshToken.entity';
import { CodeRepository } from '../repositories/code.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { AuthService } from '../services/auth.service';
import { CodeService } from '../services/code.service';
import { RefreshTokenService } from '../services/refreshToken.service';

@Module({
  imports: [
    UserModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Code, RefreshToken]),
    CacheModule,
  ],
  providers: [
    AuthService,
    CodeService,
    CodeRepository,
    RefreshTokenService,
    RefreshTokenRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
