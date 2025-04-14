import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PreSignUpService } from '../../service/pre-sign-up-parking/pre-sign-up-parking.service';
import { PreSignUpParkingDto } from '../../dto/pre-sing-up-parking.dto';

@ApiTags('pre-sign-up')
@Controller('pre-sign-up')
export class PreSignUpController {
  constructor(private readonly singUpService: PreSignUpService) {}

  @Post('pre-enrollment')
  @ApiOperation({ summary: 'Pre create of parking' })
  async create(@Body() payload: PreSignUpParkingDto) {
    return this.singUpService.preCreateParking(payload);
  }
}
