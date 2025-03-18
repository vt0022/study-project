import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { validate } from 'src/common/validators/env.validator';

config();

const validatedConfig = validate(process.env);

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: validatedConfig.DB_HOST,
  port: validatedConfig.DB_PORT,
  username: validatedConfig.DB_USER,
  password: validatedConfig.DB_PASS,
  database: validatedConfig.DB_NAME,
  entities: [__dirname + '/../domains/**/entities/*.entity{.ts,.js}'],
  synchronize: false,
};
