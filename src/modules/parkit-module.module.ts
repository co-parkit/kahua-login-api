import { Module } from '@nestjs/common';
import { SignInController } from './controller/sing-in/sign-in.controller';
import { SignUpController } from './controller/sing-up-user/sign-up.controller';
import { PreSignUpController } from './controller/pre-sing-up-parking/pre-sign-up.controller';
import { PreSignUpService } from './service/pre-sign-up-parking/pre-sign-up-parking.service';
import { SignInService } from './service/sing-in/sign-in.service';
import { SignUpService } from './service/sing-up-user/sign-up.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './database/schema-user.db';
import { DatabaseModule } from './database/database.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategie/local.strategy';
import { JwtStrategy } from './strategie/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import config from './../config';
import { ConfigType } from '@nestjs/config';
import { PreEnrolledParking } from './database/schema-pre-sing-up-parking.db';

@Module({
  imports: [
    SequelizeModule.forFeature([Users, PreEnrolledParking]),
    DatabaseModule,
    PassportModule,
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
  controllers: [SignInController, SignUpController, PreSignUpController],
  providers: [
    SignInService,
    SignUpService,
    LocalStrategy,
    JwtStrategy,
    PreSignUpService,
  ],
  exports: [SignUpService, SignInService, PreSignUpService],
})
export class ParkitModuleModule {}
