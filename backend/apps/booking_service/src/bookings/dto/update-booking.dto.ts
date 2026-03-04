import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { UpdateBookingDto as UpdateBookingDtoShared } from '@shared/dto';

export class UpdateBookingDto implements UpdateBookingDtoShared {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_used?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    cancelled_at?: Date | null;
}