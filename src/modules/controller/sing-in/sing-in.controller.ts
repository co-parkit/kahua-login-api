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
import { SignInService } from '../../service/sing-in/sing-in.service';
import { UsersDto } from '../../dto/sing-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Users } from '../../database/schema-user.db';

@UseGuards(AuthGuard('local'))
@ApiTags('sign-in')
@Controller('sign-in')
export class SignInController {
  constructor(private readonly singInService: SignInService) {}

  @Post('login')
  @ApiOperation({ summary: 'Auth of users' })
  async login(@Req() payload: Request) {
    const user = payload.user as Users;
    return this.singInService.generateJWT(user);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update of users' })
  async updateUsers(@Param('userId') id: number, @Body() payload: UsersDto) {
    return this.singInService.updateData(id, payload);
  }
}
