import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UsersService} from '../users/users.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';
import {User} from "@shared/user";
import {JwtPayload} from './jwt/jwt_handler';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
    }

    async register(dto: RegisterDto): Promise<{ access_token: string }> {
        const exists = await this.usersService.emailExists(dto.email);
        if (exists) {
            throw new ConflictException('Email already in use');
        }

        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.usersService.create(
            dto.name,
            dto.email,
            passwordHash,
        );

        return {access_token: this.signToken(user)};
    }

    async login(dto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.password_hash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {access_token: this.signToken(user)};
    }

    private signToken(user: User): string {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            is_admin: user.is_admin,
        };
        return this.jwtService.sign(payload);
    }
}
