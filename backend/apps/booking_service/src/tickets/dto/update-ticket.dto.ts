import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsDateString, IsString, Matches } from 'class-validator';
import { UpdateTicketDto as UpdateTicketDtoShared } from '@shared/dto';

export class UpdateTicketDto implements UpdateTicketDtoShared {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    event_date?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    event_time?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    quantity?: number;
}