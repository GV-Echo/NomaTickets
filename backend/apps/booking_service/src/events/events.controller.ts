import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '@shared/event';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all available events' })
    @ApiResponse({ status: 200, description: 'List of events' })
    findAll(): Promise<Event[]> {
        return this.eventsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event by id' })
    @ApiResponse({ status: 200, description: 'Event found' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    findById(@Param('id', ParseIntPipe) id: number): Promise<Event> {
        return this.eventsService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create new event' })
    @ApiResponse({ status: 201, description: 'Event created' })
    create(@Body() dto: CreateEventDto): Promise<Event> {
        return this.eventsService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event' })
    @ApiResponse({ status: 200, description: 'Event updated' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateEventDto,
    ): Promise<Event> {
        return this.eventsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete event' })
    @ApiResponse({ status: 200, description: 'Event deleted' })
    async delete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        await this.eventsService.softDelete(id);
        return { message: 'Event deleted successfully' };
    }
}