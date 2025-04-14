import {
  Controller,
  Body,
  Put,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersDto } from '../../dto/sing-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Users } from '../../database/schema-user.db';
import { SignInService } from '../../service/sing-in/sign-in.service';

@UseGuards(AuthGuard('local'))
@ApiTags('sign-in')
@Controller('sign-in')
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @Post('login')
  @ApiOperation({ summary: 'Auth of users' })
  async login(@Req() payload: Request) {
    const user = payload.user as Users;
    return this.signInService.generateJWT(user);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update of users' })
  async updateUsers(@Param('userId') id: number, @Body() payload: UsersDto) {
    return this.signInService.updateData(id, payload);
  }
}
