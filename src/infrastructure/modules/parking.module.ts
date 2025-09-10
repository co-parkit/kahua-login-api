import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PreEnrolledParking } from '../../domain/entities/pre-enrolled-parking.entity';
import { PreEnrollParkingUseCase } from '../../application/use-cases/pre-enroll-parking.use-case';
import { ParkingController } from '../controllers/parking.controller';
import { ParkingRepository } from '../repositories/parking.repository';
import { DatabaseModule } from '../../config/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([PreEnrolledParking]), DatabaseModule],
  controllers: [ParkingController],
  providers: [PreEnrollParkingUseCase, ParkingRepository],
  exports: [ParkingRepository],
})
export class ParkingModule {}
