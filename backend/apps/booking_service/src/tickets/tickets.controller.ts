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
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from '@shared/ticket';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get tickets by event id' })
    findByEvent(
        @Param('eventId', ParseIntPipe) eventId: number,
    ): Promise<Ticket[]> {
        return this.ticketsService.findByEvent(eventId);
    }

    @Get('event/:eventId/dates')
    @ApiOperation({ summary: 'Get available dates for event' })
    findDates(
        @Param('eventId', ParseIntPipe) eventId: number,
    ): Promise<Date[]> {
        return this.ticketsService.findAvailableDates(eventId);
    }

    @Get('event/:eventId/by-date')
    @ApiOperation({ summary: 'Get tickets by event and date' })
    findByEventAndDate(
        @Param('eventId', ParseIntPipe) eventId: number,
        @Query('date') date: string,
    ): Promise<Ticket[]> {
        return this.ticketsService.findByEventAndDate(eventId, date);
    }

    @Post()
    @ApiOperation({ summary: 'Create ticket' })
    @ApiResponse({ status: 201, description: 'Ticket created' })
    create(@Body() dto: CreateTicketDto): Promise<Ticket> {
        return this.ticketsService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update ticket' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTicketDto,
    ): Promise<Ticket> {
        return this.ticketsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete ticket' })
    @ApiResponse({ status: 200, description: 'Ticket deleted' })
    delete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.ticketsService.delete(id);
    }
}