import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { CreateBookingDto as CreateBookingDtoShared } from '@shared/dto';

export class CreateBookingDto implements CreateBookingDtoShared {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    ticket_id: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    user_id: number;
}