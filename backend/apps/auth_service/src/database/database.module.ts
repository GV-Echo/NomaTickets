import {Module, Global} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Pool} from 'pg';

export const PG_POOL = 'PG_POOL';

@Global()
@Module({
    providers: [
        {
            provide: PG_POOL,
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                new Pool({
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    user: config.get('DB_USER'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_NAME'),
                }),
        },
    ],
    exports: [PG_POOL],
})

export class DatabaseModule {
}