import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.setGlobalPrefix('booking');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Booking Service')
        .setDescription('NomaTickets — сервис мероприятий и бронирований')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('booking/swagger_ui', app, document);

    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });

    await app.listen(3002);
    console.log('Booking service running on http://localhost:3002');
    console.log('Swagger running on http://localhost:3002/booking/swagger_ui');
}

bootstrap();