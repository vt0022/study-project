import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariable {
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASS: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  EMAIL_HOST: string;

  @IsNumber()
  EMAIL_PORT: number;

  @IsString()
  EMAIL_USERNAME: string;

  @IsString()
  EMAIL_PASSWORD: string;

  @IsString()
  FIREBASE_STORAGE_BUCKET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariable, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.log(errors.toString());
    console.log('Use default values');
  }

  return {
    DB_HOST: validatedConfig.DB_HOST || 'localhost',
    DB_PORT: validatedConfig.DB_PORT || 5432,
    DB_USER: validatedConfig.DB_USER || 'postgres',
    DB_PASS: validatedConfig.DB_PASS || '12346789',
    DB_NAME: validatedConfig.DB_NAME || 'study-project',
    EMAIL_HOST: validatedConfig.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
    EMAIL_PORT: validatedConfig.EMAIL_PORT || 2525,
    EMAIL_USERNAME: validatedConfig.EMAIL_USERNAME || '726ac063102df9',
    EMAIL_PASSWORD: validatedConfig.EMAIL_PASSWORD || '876ef2a26938df',
    JWT_SECRET: validatedConfig.JWT_SECRET || 'my_super_secret_key',
    ACCESS_TOKEN_EXPIRES_IN: validatedConfig.ACCESS_TOKEN_EXPIRES_IN || '3600s',
    REFRESH_TOKEN_EXPIRES_IN:
      validatedConfig.REFRESH_TOKEN_EXPIRES_IN || '86400s',
    FIREBASE_STORAGE_BUCKET:
      validatedConfig.FIREBASE_STORAGE_BUCKET ||
      'study-project-a5e85.firebasestorage.app',
  };
}
