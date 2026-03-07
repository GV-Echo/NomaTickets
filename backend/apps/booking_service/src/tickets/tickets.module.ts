import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { JwtModule } from '../jwt/jwt.module';

@Module({
    imports: [JwtModule],
    controllers: [TicketsController],
    providers: [TicketsService],
})
export class TicketsModule {}