import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

ConfigModule.forRoot();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  // TODO: Validate required config
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../domains/**/entities/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production!
};
