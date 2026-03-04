import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard, PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {UsersService} from '../../users/users.service';
interface RequestWithCookies {
    cookies?: Record<string, string>;
}

export interface JwtPayload {
    sub: number;
    email: string;
    is_admin: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: RequestWithCookies) => req?.cookies?.['access_token'] ?? null,
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET')!,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        config: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: RequestWithCookies) => req?.cookies?.['refresh_token'] ?? null,
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('REFRESH_TOKEN_SECRET')!,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {}
