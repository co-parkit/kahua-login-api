import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'usuario@correo.com',
    description: 'User email to recover password',
  })
  email: string;
}
