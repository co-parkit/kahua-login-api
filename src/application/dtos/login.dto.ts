import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com'
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ 
    description: 'Contraseña del usuario',
    example: 'password123'
  })
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'usuario@correo.com',
    description: 'User email to recover password',
  })
  email: string;
}
