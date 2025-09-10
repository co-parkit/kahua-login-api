import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  id: number;

  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  lastName: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @ApiProperty({ description: 'Teléfono del usuario', required: false })
  phone?: string | null;

  @ApiProperty({ description: 'Nombre de usuario' })
  userName: string;

  @ApiProperty({ description: 'ID del rol del usuario' })
  idRole: number;

  @ApiProperty({ description: 'ID del estado del usuario' })
  idStatus: number;
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
  userId: number;

  @ApiProperty({
    description: 'Información del usuario creado',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

export class PreEnrolledParkingResponseDto {
  @ApiProperty({ description: 'ID único del parqueadero' })
  id: number;

  @ApiProperty({ description: 'Representante legal' })
  legalRepresentative: string;

  @ApiProperty({ description: 'Nombre de la empresa' })
  companyName: string;

  @ApiProperty({ description: 'ID externo único' })
  externalId: string;

  @ApiProperty({ description: 'ID interno', required: false })
  internalId: string | null;

  @ApiProperty({ description: 'Email de contacto' })
  email: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  phone: string;

  @ApiProperty({ description: 'Dirección' })
  address: string;

  @ApiProperty({ description: 'ID de la ciudad' })
  city: number;

  @ApiProperty({ description: 'Barrio' })
  neighborhood: string;

  @ApiProperty({ description: 'Tiene sucursales' })
  hasBranches: boolean;

  @ApiProperty({ description: 'Número de sucursales' })
  numberOfBranches: number;

  @ApiProperty({ description: 'Tipo de documento' })
  documentType: string;

  @ApiProperty({ description: 'Número de documento' })
  documentNumber: string;

  @ApiProperty({ description: 'Estado de la pre-inscripción' })
  isStatus: number;
}

export class PreEnrolledParkingCreateResponseDto {
  @ApiProperty({ description: 'Representante legal' })
  legalRepresentative: string;

  @ApiProperty({ description: 'Nombre de la empresa' })
  companyName: string;

  @ApiProperty({ description: 'ID externo único' })
  externalId: string;

  @ApiProperty({ description: 'ID interno', required: false })
  internalId: string | null;
}
