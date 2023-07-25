import { Module } from '@nestjs/common';
import { SingInController } from './controller/sing-in/sing-in.controller';
import { SingUpController } from './controller/sing-up/sing-up.controller';
import { SingInService } from './service/sing-in/sing-in.service';
import { SingUpService } from './service/sing-up/sing-up.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './database/schema.db';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [SequelizeModule.forFeature([Users]), DatabaseModule],
  controllers: [SingInController, SingUpController],
  providers: [SingInService, SingUpService],
  exports: [SingUpService, SingInService],
})
export class ParkitModuleModule {}
