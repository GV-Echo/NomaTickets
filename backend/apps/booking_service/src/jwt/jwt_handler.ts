import {
    Injectable,
    UnauthorizedException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import {AuthGuard, PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';

interface RequestWithCookies {
    cookies?: Record<string, string>;
}

export interface JwtPayload {
    sub: number;
    email: string;
    is_admin: boolean;
}

export interface AuthUser {
    id: number;
    email: string;
    is_admin: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: RequestWithCookies) => req?.cookies?.['access_token'] ?? null,
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET')!,
        });
    }

    validate(payload: JwtPayload): AuthUser {
        return {
            id: payload.sub,
            email: payload.email,
            is_admin: payload.is_admin,
        };
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
        const user = request.user;
        if (!user) {
            throw new UnauthorizedException('Not authenticated');
        }
        if (!user.is_admin) {
            throw new ForbiddenException('Admin access required');
        }
        return true;
    }
}
