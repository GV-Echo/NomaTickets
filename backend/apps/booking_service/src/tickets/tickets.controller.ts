import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from '@shared/ticket';
import { JwtAuthGuard, AdminGuard } from '../jwt/jwt_handler';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Get('event/:eventId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get tickets by event id' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findByEvent(
        @Param('eventId', ParseIntPipe) eventId: number,
    ): Promise<Ticket[]> {
        return this.ticketsService.findByEvent(eventId);
    }

    @Get('event/:eventId/dates')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get available dates for event' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findDates(
        @Param('eventId', ParseIntPipe) eventId: number,
    ): Promise<Date[]> {
        return this.ticketsService.findAvailableDates(eventId);
    }

    @Get('event/:eventId/by-date')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get tickets by event and date' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findByEventAndDate(
        @Param('eventId', ParseIntPipe) eventId: number,
        @Query('date') date: string,
    ): Promise<Ticket[]> {
        return this.ticketsService.findByEventAndDate(eventId, date);
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create ticket' })
    @ApiResponse({ status: 201, description: 'Ticket created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: admin access required' })
    create(@Body() dto: CreateTicketDto): Promise<Ticket> {
        return this.ticketsService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update ticket' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: admin access required' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTicketDto,
    ): Promise<Ticket> {
        return this.ticketsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete ticket' })
    @ApiResponse({ status: 200, description: 'Ticket deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: admin access required' })
    delete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.ticketsService.delete(id);
    }
}