import {
    Controller,
    Post,
    Get,
    Body,
    Res,
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
import type {Response} from 'express';
import {AuthService, TokenPair} from './auth.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';
import {JwtAuthGuard, RefreshAuthGuard} from './jwt/jwt_handler';
import {User} from '@shared/user';

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'strict' as const,
    path: '/',
};

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    @ApiOperation({summary: 'Register a new user'})
    @ApiResponse({status: 201, description: 'Sets HttpOnly cookies'})
    @ApiResponse({status: 409, description: 'Email already in use'})
    async register(@Body() dto: RegisterDto, @Res({passthrough: true}) res: Response) {
        const tokens = await this.authService.register(dto);
        this.setTokenCookies(res, tokens);
        return {message: 'Registered successfully'};
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Login and receive JWT'})
    @ApiResponse({status: 200, description: 'Sets HttpOnly cookies'})
    @ApiResponse({status: 401, description: 'Invalid credentials'})
    async login(@Body() dto: LoginDto, @Res({passthrough: true}) res: Response) {
        const tokens = await this.authService.login(dto);
        this.setTokenCookies(res, tokens);
        return {message: 'Logged in successfully'};
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @ApiOperation({summary: 'Refresh access and refresh tokens'})
    @ApiResponse({status: 200, description: 'Issues new token pair via cookies'})
    @ApiResponse({status: 401, description: 'Invalid or expired refresh token'})
    async refresh(@Request() req: { user: User }, @Res({passthrough: true}) res: Response) {
        const tokens = await this.authService.refresh(req.user);
        this.setTokenCookies(res, tokens);
        return {message: 'Tokens refreshed'};
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Logout — clears token cookies'})
    @ApiResponse({status: 200, description: 'Cookies cleared'})
    logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie('access_token', COOKIE_OPTIONS);
        res.clearCookie('refresh_token', COOKIE_OPTIONS);
        return {message: 'Logged out'};
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

    private setTokenCookies(res: Response, tokens: TokenPair) {
        res.cookie('access_token', tokens.access_token, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 3600000, // Неделя
        });
        res.cookie('refresh_token', tokens.refresh_token, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 3600000, // Неделя
        });
    }
}
