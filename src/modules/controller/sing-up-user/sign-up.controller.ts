import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../dto/sing-up-user.dto';
import { SignUpService } from '../../service/sing-up-user/sign-up.service';

@ApiTags('sign-up-parking')
@Controller('sign-up')
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post()
  @ApiOperation({ summary: 'Create of users' })
  async create(@Body() payload: CreateUserDto) {
    return this.signUpService.createUser(payload);
  }
}
