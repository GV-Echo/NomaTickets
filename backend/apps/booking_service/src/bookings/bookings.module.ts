import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { JwtModule } from '../jwt/jwt.module';

@Module({
    imports: [JwtModule],
    controllers: [BookingsController],
    providers: [BookingsService],
})
export class BookingsModule {}