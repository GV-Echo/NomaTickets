import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsString, MinLength, MaxLength} from 'class-validator';
import {CreateUserDto} from "@shared/dto";


export class RegisterDto implements CreateUserDto {
    @ApiProperty({example: 'Ivan Petrov'})
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({example: 'ivan@example.com'})
    @IsEmail()
    email: string;

    @ApiProperty({example: 'strongPassword123', minLength: 6})
    @IsString()
    @MinLength(6)
    @MaxLength(64)
    password: string;
}
