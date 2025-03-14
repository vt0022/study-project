import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './domains/auth/modules/auth.module';
import { UserModule } from './domains/users/modules/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
