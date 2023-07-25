import { Controller, Get, Body, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SingInService } from '../../service/sing-in/sing-in.service';
import { Users } from 'src/modules/database/schema.db';
import { UsersDto } from '../../dtos/sing-in.dto';

@ApiTags('sing-in')
@Controller('sing-in')
export class SingInController {
  constructor(private singInService: SingInService) {}

  @Get()
  @ApiOperation({ summary: 'List of users' })
  async getUsers(): Promise<Users[]> {
    return this.singInService.findAll();
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update of users' })
  async updateUsers(@Param('userId') id: number, @Body() payload: UsersDto) {
    return this.singInService.updateData(id, payload);
  }
}
