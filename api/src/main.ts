import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/globalHttpException.filter';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { LoggerFactory } from './common/loggers/loggerFactory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('Study Project'),
  });

  app.setGlobalPrefix('api');

  app.enableCors();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Study Project')
    .setDescription('API description of the study project')
    .setVersion('1.0')
    .addTag('study')
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json-spec',
    yamlDocumentUrl: 'swagger/yaml-spec',
    customSiteTitle: 'API DOCS',
    swaggerOptions: {
      tryItOutEnabled: true,
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
