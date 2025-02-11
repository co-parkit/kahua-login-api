import { Module } from '@nestjs/common';
import { SignInController } from './controller/sing-in/sing-in.controller';
import { SingUpController } from './controller/sing-up-user/sing-up.controller';
import { PreSingUpController } from './controller/pre-sing-up-parking/pre-sing-up.controller';
import { PreSignUpService } from './service/pre-sing-up-parking/pre-sing-up-parking.service';
import { SignInService } from './service/sing-in/sing-in.service';
import { SingUpService } from './service/sing-up-user/sing-up.service';
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
            expiresIn: '10m',
          },
        };
      },
    }),
  ],
  controllers: [SignInController, SingUpController, PreSingUpController],
  providers: [
    SignInService,
    SingUpService,
    LocalStrategy,
    JwtStrategy,
    PreSignUpService,
  ],
  exports: [SingUpService, SignInService, PreSignUpService],
})
export class ParkitModuleModule {}
