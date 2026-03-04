import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsInt, Min } from 'class-validator';
import { CreateEventDto as CreateEventDtoShared } from '@shared/dto';

export class CreateEventDto implements CreateEventDtoShared {
    @ApiProperty({ example: 'Rock Concert' })
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    name: string;

    @ApiProperty({ example: 'Live music concert', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'https://image-url.com/photo.jpg', required: false })
    @IsOptional()
    @IsString()
    photo?: string;

    @ApiProperty({ example: 120 })
    @IsInt()
    @Min(1)
    duration: number;
}