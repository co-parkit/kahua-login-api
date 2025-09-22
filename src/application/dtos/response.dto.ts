import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  id: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @ApiProperty({
    description: 'Tipo de usuario',
    enum: ['employee', 'customer'],
  })
  user_type: 'employee' | 'customer';

  @ApiProperty({ description: 'ID del rol del usuario', required: false })
  role_id?: number | null;

  @ApiProperty({ description: 'Fecha de creación' })
  created_at: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  updated_at: Date;

  @ApiProperty({ description: 'Fecha de eliminación', required: false })
  deleted_at?: Date | null;

  @ApiProperty({ description: 'Nombre completo del usuario', required: false })
  full_name?: string;

  @ApiProperty({ description: 'Teléfono del usuario', required: false })
  phone?: string;

  @ApiProperty({ description: 'Foto de perfil del usuario', required: false })
  profile_picture?: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Token de acceso JWT' })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

export class UserCreateResponseDto {
  @ApiProperty({ description: 'ID del usuario creado' })
  userId: string;

  @ApiProperty({
    description: 'Información del usuario creado',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
