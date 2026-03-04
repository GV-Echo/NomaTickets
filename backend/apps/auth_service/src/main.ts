import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.setGlobalPrefix('auth');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Auth Service')
        .setDescription('NomaTickets — сервис аутентификации и управления пользователями')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('auth/swagger_ui', app, document, {jsonDocumentUrl: "auth/swagger_json"});

    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });

    await app.listen(3001);
    console.log('Auth service running on http://localhost:3001');
    console.log('URL for swagger: http://localhost:3001/auth/swagger_ui');
}

bootstrap();
