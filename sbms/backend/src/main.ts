import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
<<<<<<< HEAD
import { mkdirSync } from 'fs';
import { join } from 'path';
import * as express from 'express';
=======
>>>>>>> origin/Full-Backend

async function bootstrap() {

  mkdirSync(join(process.cwd(), 'uploads', 'tasks'), { recursive: true });
  mkdirSync(join(process.cwd(), 'uploads', 'completed'), { recursive: true });

  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads')),
  );
=======
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
>>>>>>> origin/Full-Backend

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('SBMS Super Admin API')
    .setDescription('API documentation for the SBMS Super Admin application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(port);
<<<<<<< HEAD
  console.log(`SBMS project running on http://localhost:${port}/api/v1`);
=======

  console.log(
    `SBMS Super Admin API running on http://localhost:${port}/api/v1`,
  );
>>>>>>> origin/Full-Backend
}

void bootstrap();