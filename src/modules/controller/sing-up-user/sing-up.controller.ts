import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../dto/sing-up-user.dto';
import { SingUpService } from '../../service/sing-up-user/sing-up.service';

@ApiTags('sing-up-parking')
@Controller('sing-up-parking')
export class SingUpController {
  constructor(private readonly singUpService: SingUpService) {}

  @Post()
  @ApiOperation({ summary: 'Create of users' })
  async create(@Body() payload: CreateUserDto) {
    return this.singUpService.createUser(payload);
  }
}
