import {Injectable, Inject} from '@nestjs/common';
import {Pool} from 'pg';
import {User} from '@shared/user';
import {PG_POOL} from '../database/database.module';

@Injectable()
export class UsersService {
    constructor(@Inject(PG_POOL) private readonly pool: Pool) {
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email],
        );
        return result.rows[0] ?? null;
    }

    async findById(id: number): Promise<User | null> {
        const result = await this.pool.query(
            'SELECT id, name, email, is_admin, created_at FROM users WHERE id = $1',
            [id],
        );
        return result.rows[0] ?? null;
    }

    async create(
        name: string,
        email: string,
        passwordHash: string,
    ): Promise<User> {
        const result = await this.pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, is_admin, created_at`,
            [name, email, passwordHash],
        );
        return result.rows[0];
    }

    async emailExists(email: string): Promise<boolean> {
        const result = await this.pool.query(
            'SELECT 1 FROM users WHERE email = $1',
            [email],
        );

        const out_res = result.rowCount
        if (out_res === null) {
            return false;
        } else {
            return out_res != 0;
        }
    }
}
