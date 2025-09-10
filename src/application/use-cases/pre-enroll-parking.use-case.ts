import { Injectable } from '@nestjs/common';
import { ParkingRepository } from '../../infrastructure/repositories/parking.repository';
import { PreEnrolledParkingModel } from '../../domain/models/pre-enrolled-parking.model';
import { PreSignUpParkingDto } from '../dtos/parking.dto';
import {
  ParkingEmailAlreadyExistsException,
  InvalidBusinessRuleException,
} from '../../domain/exceptions';
import { randomUUID } from 'crypto';

@Injectable()
export class PreEnrollParkingUseCase {
  constructor(private readonly parkingRepository: ParkingRepository) {}

  async execute(
    preSignUpDto: PreSignUpParkingDto,
  ): Promise<PreEnrolledParkingModel> {
    const existingParking = await this.parkingRepository.findByEmail(
      preSignUpDto.email,
    );

    if (existingParking) {
      throw new ParkingEmailAlreadyExistsException(preSignUpDto.email);
    }

    if (preSignUpDto.hasBranches && preSignUpDto.numberOfBranches <= 0) {
      throw new InvalidBusinessRuleException(
        'Number of branches must be greater than 0 when hasBranches is true',
      );
    }

    const parkingData = {
      legalRepresentative: preSignUpDto.legalRepresentative,
      nitDV: preSignUpDto.nitDV,
      phone: preSignUpDto.phone,
      email: preSignUpDto.email,
      address: preSignUpDto.address,
      city: preSignUpDto.city,
      neighborhood: preSignUpDto.neighborhood,
      hasBranches: preSignUpDto.hasBranches,
      numberOfBranches: preSignUpDto.numberOfBranches,
      companyName: preSignUpDto.companyName,
      documentType: preSignUpDto.documentType,
      documentNumber: preSignUpDto.documentNumber,
      idFiles: null,
      isStatus: 1,
      internalId: preSignUpDto.internalId,
      externalId: preSignUpDto.internalId ? null : randomUUID(),
    };
    return await this.parkingRepository.create(parkingData);
  }
}
