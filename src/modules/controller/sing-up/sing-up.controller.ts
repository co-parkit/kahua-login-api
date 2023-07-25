import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../dtos/sing-up.dto';
import { SingUpService } from '../../service/sing-up/sing-up.service';

@ApiTags('sing-up')
@Controller('sing-up')
export class SingUpController {
  constructor(private singUpService: SingUpService) {}

  @Post()
  @ApiOperation({ summary: 'Create of users' })
  async create(@Body() payload: CreateUserDto) {
    return this.singUpService.createUser(payload);
  }
}
