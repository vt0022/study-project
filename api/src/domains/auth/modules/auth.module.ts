import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/domains/users/modules/user.module';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { EmailModule } from 'src/domains/email/email.module';
import { CodeService } from '../services/code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code } from '../entities/code.entity';

@Module({
  imports: [
    UserModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([Code]),
  ],
  providers: [AuthService, CodeService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
