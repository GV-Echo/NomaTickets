import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@shared/booking';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get bookings by user id' })
    findByUser(
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<Booking[]> {
        return this.bookingsService.findByUser(userId);
    }

    @Post()
    @ApiOperation({ summary: 'Create booking' })
    @ApiResponse({ status: 201, description: 'Booking created' })
    create(@Body() dto: CreateBookingDto): Promise<Booking> {
        return this.bookingsService.create(dto);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel booking' })
    cancel(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Booking> {
        return this.bookingsService.cancel(id);
    }
}