import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { PreEnrollParkingUseCase } from '../../application/use-cases/pre-enroll-parking.use-case';
import { PreSignUpParkingDto } from '../../application/dtos/parking.dto';
import { PreEnrolledParkingCreateResponseDto } from '../../application/dtos/response.dto';

@ApiTags('parking')
@Controller('parking')
export class ParkingController {
  constructor(
    private readonly preEnrollParkingUseCase: PreEnrollParkingUseCase,
  ) {}

  @Post('pre-enroll')
  @ApiOperation({ summary: 'Pre-inscripción de parqueadero' })
  @ApiResponse({
    status: 201,
    description: 'Pre-inscripción creada exitosamente',
    type: PreEnrolledParkingCreateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async preEnroll(@Body() preSignUpDto: PreSignUpParkingDto) {
    const parking = await this.preEnrollParkingUseCase.execute(preSignUpDto);
    return {
      legalRepresentative: parking.legalRepresentative,
      companyName: parking.companyName,
      externalId: parking.externalId,
      internalId: parking.internalId,
    };
  }
}
