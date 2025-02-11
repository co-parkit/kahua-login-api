import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class PreSignUpParkingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `parking legal representative` })
  readonly legal_representative: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `parking nit + DV` })
  readonly nit_DV: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{1,10}$/, {
    message:
      'Phone number must contain only digits and be up to 10 characters long.',
  })
  @ApiProperty({ description: `parking phone` })
  readonly phone: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `parking email` })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `parking address` })
  readonly address: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: `parking city` })
  readonly city: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `parking neighborhood` })
  readonly neighborhood: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: `parking has_branches` })
  readonly has_branches: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: `parking number_of_branches` })
  readonly number_of_branches: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `parking company_name` })
  readonly company_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `parking document_type` })
  readonly document_type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `parking document_number` })
  readonly document_number: string;

  @IsOptional()
  @Matches(/^\d{6}$/, {
    message: 'Internal ID must contain exactly 6 digits.',
  })
  readonly internal_id?: string;

  @IsOptional()
  @IsUUID('4')
  readonly external_id?: string;
}

export class UpdatPreSignUpParkingDto extends PartialType(
  PreSignUpParkingDto,
) {}
