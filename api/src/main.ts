import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  app.enableCors();

  app.use(helmet( {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('Study Project')
    .setDescription('API description of the study project')
    .setVersion('1.0')
    .addTag('study')
    .addBearerAuth()
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

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
