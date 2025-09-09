import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';

import { User } from '../../domain/entities/user.entity';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.use-case';
import { AuthService } from '../../application/services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../repositories/user.repository';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { DatabaseModule } from '../../config/database.module';
import { MyLogger } from '../../config/logger';
import config from '../../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '4h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    ForgotPasswordUseCase,
    AuthService,
    UserRepository,
    LocalStrategy,
    JwtStrategy,
    MyLogger,
  ],
  exports: [AuthService, UserRepository, MyLogger],
})
export class AuthModule {}
