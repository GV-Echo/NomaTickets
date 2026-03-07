import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { JwtModule } from '../jwt/jwt.module';

@Module({
    imports: [JwtModule],
    controllers: [EventsController],
    providers: [EventsService],
})
export class EventsModule {}