import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

<<<<<<< Updated upstream
=======
  app.enableCors({
    origin: 'http://localhost:3001', 
    credentials: true,
  });
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  console.log(
    `SBMS Super Admin API running on http://localhost:${port}/api/v1`,
  );
}
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
void bootstrap();
