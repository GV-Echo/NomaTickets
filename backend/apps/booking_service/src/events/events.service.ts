import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { Event } from '@shared/event';
import { PG_POOL } from '../database/database.module';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

    async findAll(): Promise<Event[]> {
        const result = await this.pool.query(
            `SELECT * FROM events
             WHERE deleted_at IS NULL
             ORDER BY created_at DESC`
        );
        return result.rows;
    }

    async findById(id: number): Promise<Event> {
        const result = await this.pool.query(
            `SELECT * FROM events
             WHERE id = $1 AND deleted_at IS NULL`,
            [id],
        );

        const event = result.rows[0];
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        return event;
    }

    async create(dto: CreateEventDto): Promise<Event> {
        const result = await this.pool.query(
            `INSERT INTO events (name, description, photo, duration)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                dto.name,
                dto.description ?? null,
                dto.photo ?? null,
                dto.duration,
            ],
        );

        return result.rows[0];
    }

    async update(id: number, dto: UpdateEventDto): Promise<Event> {
        await this.findById(id);

        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const key of Object.keys(dto)) {
            fields.push(`${key} = $${index}`);
            values.push((dto as any)[key]);
            index++;
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        const result = await this.pool.query(
            `UPDATE events
             SET ${fields.join(', ')}
             WHERE id = $${index}
             RETURNING *`,
            [...values, id],
        );

        return result.rows[0];
    }

    async softDelete(id: number): Promise<void> {
        await this.findById(id);

        await this.pool.query(
            `UPDATE events
             SET deleted_at = NOW(), is_available = false
             WHERE id = $1`,
            [id],
        );
    }
}