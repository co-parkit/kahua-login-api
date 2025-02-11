import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PreEnrolledParking } from '../../database/schema-pre-sing-up-parking.db';
import { CODES } from '../../../config/general.codes';
import { Response } from '../../models/response.model';
import { PreSignUpParkingDto } from '../../dto/pre-sing-up-parking.dto';
import { UUIDV4 } from 'sequelize';

@Injectable()
export class PreSignUpService {
  constructor(
    @InjectModel(PreEnrolledParking)
    private readonly enrolledParking: typeof PreEnrolledParking,
  ) {}

  async preCreateParking(data: PreSignUpParkingDto): Promise<Response> {
    const newParking = {
      ...data,
      external_id: data.internal_id ? null : UUIDV4(),
    };

    const createdParking = await this.enrolledParking.create(newParking);

    const responseData = {
      legal_representative: createdParking.legal_representative,
      company_name: createdParking.company_name,
      external_id: createdParking.external_id,
      internal_id: createdParking.internal_id,
    };

    return new Response(CODES.PKL_PARKING_CREATE_OK, responseData);
  }
}
