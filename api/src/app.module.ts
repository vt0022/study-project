import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './domains/auth/modules/auth.module';
import { UserModule } from './domains/users/modules/user.module';
import { PostModule } from './domains/posts/modules/post.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/validators/env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({ validate, isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
