import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { Booking } from '@shared/booking';
import { PG_POOL } from '../database/database.module';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

    async findByUser(userId: number): Promise<Booking[]> {
        const result = await this.pool.query(
            `SELECT * FROM bookings
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId],
        );

        return result.rows;
    }

    async create(dto: CreateBookingDto): Promise<Booking> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            // 1️⃣ Получаем билет
            const ticketResult = await client.query(
                `SELECT * FROM tickets WHERE id = $1 FOR UPDATE`,
                [dto.ticket_id],
            );

            const ticket = ticketResult.rows[0];

            if (!ticket) {
                throw new NotFoundException('Ticket not found');
            }

            if (ticket.quantity <= 0) {
                throw new BadRequestException('No tickets available');
            }

            // 2️⃣ Уменьшаем количество
            await client.query(
                `UPDATE tickets
                 SET quantity = quantity - 1
                 WHERE id = $1`,
                [dto.ticket_id],
            );

            // 3️⃣ Создаём бронь
            const bookingResult = await client.query(
                `INSERT INTO bookings (ticket_id, user_id, is_used, cancelled_at, created_at)
                 VALUES ($1, $2, false, NULL, NOW())
                 RETURNING *`,
                [dto.ticket_id, dto.user_id],
            );

            await client.query('COMMIT');

            return bookingResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async cancel(id: number): Promise<Booking> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const bookingResult = await client.query(
                `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
                [id],
            );

            const booking = bookingResult.rows[0];

            if (!booking) {
                throw new NotFoundException('Booking not found');
            }

            if (booking.cancelled_at) {
                throw new BadRequestException('Booking already cancelled');
            }

            // Возвращаем билет
            await client.query(
                `UPDATE tickets
                 SET quantity = quantity + 1
                 WHERE id = $1`,
                [booking.ticket_id],
            );

            const updatedBooking = await client.query(
                `UPDATE bookings
                 SET cancelled_at = NOW()
                 WHERE id = $1
                 RETURNING *`,
                [id],
            );

            await client.query('COMMIT');

            return updatedBooking.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}