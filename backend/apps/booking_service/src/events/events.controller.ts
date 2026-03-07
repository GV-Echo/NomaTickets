import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '@shared/event';
import { JwtAuthGuard, AdminGuard } from '../jwt/jwt_handler';

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
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new event' })
    @ApiResponse({ status: 201, description: 'Event created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: admin access required' })
    create(@Body() dto: CreateEventDto): Promise<Event> {
        return this.eventsService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update event' })
    @ApiResponse({ status: 200, description: 'Event updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: admin access required' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateEventDto,
    ): Promise<Event> {
        return this.eventsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Soft delete event' })
    @ApiResponse({ status: 200, description: 'Event deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden: admin access required' })
    async delete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        await this.eventsService.softDelete(id);
        return { message: 'Event deleted successfully' };
    }
}