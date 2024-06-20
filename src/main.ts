import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { TransformInterceptor } from './utils';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  const server = app.getHttpServer();
  server.keepAliveTimeout = 60000;
  server.headersTimeout = 60000;

  // use interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger API
  // const config = new DocumentBuilder().setTitle('Chat Api').setDescription('The Chat API description').setVersion('1.0').addBearerAuth().build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/doc/swagger', app, document);

  await app.listen(process.env.PORT, () => console.log('App listening on port ' + process.env.PORT));
}
bootstrap();
