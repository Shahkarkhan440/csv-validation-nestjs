import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Csv File Validation')
    .setDescription('Use upload file endpoint to validate your csv as per your validatoin rules in the DTO')
    .setVersion('1.0')
    .addServer(`${process.env.APP_BASE_URL}:${process.env.PORT}`)
    .addBearerAuth()
    .addGlobalParameters()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/api', app, document);
  
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
