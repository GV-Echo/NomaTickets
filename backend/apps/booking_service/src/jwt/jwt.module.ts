import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, JwtAuthGuard, AdminGuard } from './jwt_handler';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [JwtStrategy, JwtAuthGuard, AdminGuard],
    exports: [JwtAuthGuard, AdminGuard, PassportModule],
})
export class JwtModule {}

