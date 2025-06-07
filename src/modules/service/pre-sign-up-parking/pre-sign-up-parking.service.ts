import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreEnrolledParking } from '../../database/schema-pre-sing-up-parking.db';
import { CODES } from '../../../config/general.codes';
import { Response } from '../../models/response.model';
import { PreSignUpParkingDto } from '../../dto/pre-sing-up-parking.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class PreSignUpService {
  constructor(
    @InjectRepository(PreEnrolledParking)
    private readonly enrolledParkingRepository: Repository<PreEnrolledParking>,
  ) {}

  async preCreateParking(data: PreSignUpParkingDto): Promise<Response> {
    const newParking = this.enrolledParkingRepository.create({
      ...data,
      externalId: data.internalId ? null : randomUUID(),
    });

    const createdParking = await this.enrolledParkingRepository.save(
      newParking,
    );

    const responseData = {
      legal_representative: createdParking.legalRepresentative,
      company_name: createdParking.companyName,
      external_id: createdParking.externalId,
      internal_id: createdParking.internalId,
    };

    return new Response(CODES.PKL_PARKING_CREATE_OK, responseData);
  }
}
