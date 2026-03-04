import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {UsersService} from '../users/users.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';
import {User} from "@shared/user";
import {JwtPayload} from './jwt/jwt_handler';

const SALT_ROUNDS = 10;

export interface TokenPair {
    access_token: string;
    refresh_token: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) {
    }

    async register(dto: RegisterDto): Promise<TokenPair> {
        const exists = await this.usersService.emailExists(dto.email);
        if (exists) {
            throw new ConflictException('Email already in use');
        }
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.usersService.create(dto.name, dto.email, passwordHash);
        return this.signTokenPair(user);
    }

    async login(dto: LoginDto): Promise<TokenPair> {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.password_hash) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.signTokenPair(user);
    }

    async refresh(user: User): Promise<TokenPair> {
        return this.signTokenPair(user);
    }

    private signTokenPair(user: User): TokenPair {
        const payload: JwtPayload = {sub: user.id, email: user.email, is_admin: user.is_admin};

        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.config.get('REFRESH_TOKEN_SECRET'),
            expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES_IN'),
        });

        return {access_token, refresh_token};
    }
}
