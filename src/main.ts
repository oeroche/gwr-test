import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .addBearerAuth({
      in: 'header',
      'x-tokenName': 'Authorization',
      name: 'Authorization',
      type: 'apiKey',
      bearerFormat: 'JWT',
      description:
        'Enter the token with the `Bearer ` prefix, e.g. "Bearer abcde12345".',
    })
    .setTitle('Ody test API')
    .setDescription('The ody test API documentation')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
