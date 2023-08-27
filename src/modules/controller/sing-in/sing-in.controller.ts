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
import { SingInService } from '../../service/sing-in/sing-in.service';
import { UsersDto } from '../../dtos/sing-in.dto';
import { ApiKeyGuard } from '../../../auth/guards/api-key.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Users } from '../../database/schema.db';

@UseGuards(ApiKeyGuard)
@UseGuards(AuthGuard('local'))
@ApiTags('sing-in')
@Controller('sing-in')
export class SingInController {
  constructor(private singInService: SingInService) {}

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
