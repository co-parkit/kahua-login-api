import { Module } from '@nestjs/common';
import { SingInController } from './controller/sing-in/sing-in.controller';
import { SingUpController } from './controller/sing-up/sing-up.controller';
import { SingInService } from './service/sing-in/sing-in.service';
import { SingUpService } from './service/sing-up/sing-up.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './database/schema.db';
import { DatabaseModule } from './database/database.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategie/local.strategy';
import { JwtStrategy } from './strategie/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import config from './../config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
    }),
  ],
  controllers: [SingInController, SingUpController],
  providers: [SingInService, SingUpService, LocalStrategy, JwtStrategy],
  exports: [SingUpService, SingInService],
})
export class ParkitModuleModule {}
