import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@shared/booking';
import { JwtAuthGuard } from '../jwt/jwt_handler';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get bookings by user id' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findByUser(
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<Booking[]> {
        return this.bookingsService.findByUser(userId);
    }

    @Post()
    @ApiOperation({ summary: 'Create booking' })
    @ApiResponse({ status: 201, description: 'Booking created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() dto: CreateBookingDto): Promise<Booking> {
        return this.bookingsService.create(dto);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel booking' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    cancel(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Booking> {
        return this.bookingsService.cancel(id);
    }
}