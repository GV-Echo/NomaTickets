import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';
import {JwtAuthGuard} from './jwt/jwt_handler';
import {User} from "@shared/user";

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    @ApiOperation({summary: 'Register a new user'})
    @ApiResponse({status: 201, description: 'Returns JWT access token'})
    @ApiResponse({status: 409, description: 'Email already in use'})
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Login and receive JWT'})
    @ApiResponse({status: 200, description: 'Returns JWT access token'})
    @ApiResponse({status: 401, description: 'Invalid credentials'})
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: 'Get current authenticated user'})
    @ApiResponse({status: 200, description: 'Returns user profile'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    getMe(@Request() req: { user: User }) {
        return req.user;
    }
}
