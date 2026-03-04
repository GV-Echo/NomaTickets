import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsDateString, IsString, Matches } from 'class-validator';
import { CreateTicketDto as CreateTicketDtoShared } from '@shared/dto';

export class CreateTicketDto implements CreateTicketDtoShared {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    event_id: number;

    @ApiProperty({ example: '2026-05-01' })
    @IsDateString()
    event_date: Date;

    @ApiProperty({ example: '18:30' })
    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    event_time: string;

    @ApiProperty({ example: 50 })
    @IsInt()
    @Min(0)
    price: number;

    @ApiProperty({ example: 100 })
    @IsInt()
    @Min(0)
    quantity: number;
}