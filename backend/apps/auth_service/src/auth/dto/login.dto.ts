import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsString, MinLength} from 'class-validator';
import {LoginUserDto} from "@shared/dto";

export class LoginDto implements LoginUserDto {
    @ApiProperty({example: 'ivan@example.com'})
    @IsEmail()
    email: string;

    @ApiProperty({example: 'strongPassword123'})
    @IsString()
    @MinLength(6)
    password: string;
}
