import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreEnrolledParking } from '../../domain/entities/pre-enrolled-parking.entity';
import { PreEnrolledParkingModel } from '../../domain/models/pre-enrolled-parking.model';
import { IParkingRepository } from '../../domain/interfaces/parking.repository.interface';

/**
 * Implementación del repositorio de pre-inscripciones de parqueaderos
 * Maneja la persistencia de datos usando TypeORM
 */
@Injectable()
export class ParkingRepository implements IParkingRepository {
  constructor(
    @InjectRepository(PreEnrolledParking)
    private readonly parkingRepository: Repository<PreEnrolledParking>,
  ) {}

  async findById(id: number): Promise<PreEnrolledParkingModel | null> {
    const parking = await this.parkingRepository.findOne({ where: { id } });
    return parking ? PreEnrolledParkingModel.fromEntity(parking) : null;
  }

  async findByEmail(email: string): Promise<PreEnrolledParkingModel | null> {
    const parking = await this.parkingRepository.findOne({ where: { email } });
    return parking ? PreEnrolledParkingModel.fromEntity(parking) : null;
  }

  async findByInternalId(
    internalId: string,
  ): Promise<PreEnrolledParkingModel | null> {
    const parking = await this.parkingRepository.findOne({
      where: { internalId },
    });
    return parking ? PreEnrolledParkingModel.fromEntity(parking) : null;
  }

  async findByExternalId(
    externalId: string,
  ): Promise<PreEnrolledParkingModel | null> {
    const parking = await this.parkingRepository.findOne({
      where: { externalId },
    });
    return parking ? PreEnrolledParkingModel.fromEntity(parking) : null;
  }

  async create(
    parkingData: Partial<PreEnrolledParkingModel>,
  ): Promise<PreEnrolledParkingModel> {
    const newParking = this.parkingRepository.create(parkingData);
    const savedParking = await this.parkingRepository.save(newParking);
    return PreEnrolledParkingModel.fromEntity(savedParking);
  }

  async update(
    id: number,
    parkingData: Partial<PreEnrolledParkingModel>,
  ): Promise<PreEnrolledParkingModel> {
    await this.parkingRepository.update(id, parkingData);
    const updatedParking = await this.parkingRepository.findOne({
      where: { id },
    });
    return PreEnrolledParkingModel.fromEntity(updatedParking);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.parkingRepository.delete(id);
    return result.affected > 0;
  }

  async findAll(): Promise<PreEnrolledParkingModel[]> {
    const parkings = await this.parkingRepository.find();
    return parkings.map((parking) =>
      PreEnrolledParkingModel.fromEntity(parking),
    );
  }
}
