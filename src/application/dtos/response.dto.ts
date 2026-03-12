import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  readonly id!: string;

  @ApiProperty({ description: 'Email del usuario' })
  readonly email!: string;

  @ApiProperty({
    description: 'Tipo de usuario',
    enum: ['employee', 'customer'],
  })
  readonly user_type!: 'employee' | 'customer';

  @ApiProperty({ description: 'ID del rol del usuario', required: false })
  readonly role_id?: number | null;

  @ApiProperty({ description: 'Fecha de creación' })
  readonly created_at!: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  readonly updated_at!: Date;

  @ApiProperty({ description: 'Fecha de eliminación', required: false })
  readonly deleted_at?: Date | null;

  @ApiProperty({ description: 'Nombre completo del usuario', required: false })
  readonly full_name?: string;

  @ApiProperty({ description: 'Teléfono del usuario', required: false })
  readonly phone?: string;

  @ApiProperty({ description: 'Foto de perfil del usuario', required: false })
  readonly profile_picture?: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Token de acceso JWT' })
  readonly access_token!: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserResponseDto,
  })
  readonly user!: UserResponseDto;
}

export class UserCreateResponseDto {
  @ApiProperty({ description: 'ID del usuario creado' })
  readonly userId!: string;

  @ApiProperty({
    description: 'Información del usuario creado',
    type: UserResponseDto,
  })
  readonly user!: UserResponseDto;
}
