import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { Ticket } from '@shared/ticket';
import { PG_POOL } from '../database/database.module';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
    constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

    async findByEvent(eventId: number): Promise<Ticket[]> {
        const result = await this.pool.query(
            `SELECT * FROM tickets
             WHERE event_id = $1
             ORDER BY event_date, event_time`,
            [eventId],
        );

        return result.rows;
    }

    async findAvailableDates(eventId: number): Promise<Date[]> {
        const result = await this.pool.query(
            `SELECT DISTINCT event_date
             FROM tickets
             WHERE event_id = $1 AND quantity > 0
             ORDER BY event_date`,
            [eventId],
        );

        return result.rows.map(row => row.event_date);
    }

    async findByEventAndDate(eventId: number, date: string): Promise<Ticket[]> {
        const result = await this.pool.query(
            `SELECT * FROM tickets
             WHERE event_id = $1 AND event_date = $2
             ORDER BY event_time`,
            [eventId, date],
        );

        return result.rows;
    }

    async create(dto: CreateTicketDto): Promise<Ticket> {
        const result = await this.pool.query(
            `INSERT INTO tickets (event_id, event_date, event_time, price, quantity)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                dto.event_id,
                dto.event_date,
                dto.event_time,
                dto.price,
                dto.quantity,
            ],
        );

        return result.rows[0];
    }

    async update(id: number, dto: UpdateTicketDto): Promise<Ticket> {
        const existing = await this.pool.query(
            `SELECT * FROM tickets WHERE id = $1`,
            [id],
        );

        if (!existing.rows[0]) {
            throw new NotFoundException('Ticket not found');
        }

        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const key of Object.keys(dto)) {
            fields.push(`${key} = $${index}`);
            values.push((dto as any)[key]);
            index++;
        }

        if (fields.length === 0) {
            return existing.rows[0];
        }

        const result = await this.pool.query(
            `UPDATE tickets
             SET ${fields.join(', ')}
             WHERE id = $${index}
             RETURNING *`,
            [...values, id],
        );

        return result.rows[0];
    }
}