import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { UpdateEventDto as UpdateEventDtoShared } from '@shared/dto';

export class UpdateEventDto implements UpdateEventDtoShared {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    photo?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    duration?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_available?: boolean;
}