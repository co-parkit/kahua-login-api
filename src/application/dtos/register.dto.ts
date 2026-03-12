import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  MinLength,
  IsEnum,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `user's email` })
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: `user's password` })
  readonly password!: string;

  @IsEnum(['employee', 'customer'])
  @IsNotEmpty()
  @ApiProperty({ description: `user's type`, enum: ['employee', 'customer'] })
  readonly user_type!: 'employee' | 'customer';

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `user's role_id`, required: false })
  readonly role_id?: number | null;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `user's email` })
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: `user's password` })
  readonly password!: string;

  @IsEnum(['employee', 'customer'])
  @IsNotEmpty()
  @ApiProperty({ description: `user's type`, enum: ['employee', 'customer'] })
  readonly user_type!: 'employee' | 'customer';

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `user's role_id`, required: false })
  readonly role_id?: number | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: `user's role_id (alternative field name)`,
    required: false,
  })
  readonly id_role?: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `user's first name` })
  readonly name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `user's last name` })
  readonly last_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `user's full name` })
  readonly full_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `user's phone` })
  readonly phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `user's profile picture URL` })
  readonly profile_picture?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `user's age` })
  readonly age?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `user's city_id` })
  readonly city_id?: number;

  // Campos específicos para empleados
  @IsString()
  @IsOptional()
  @ApiProperty({ description: `employee's department` })
  readonly department?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `employee's position` })
  readonly position?: string;

  // Campos específicos para clientes
  @IsOptional()
  @ApiProperty({ description: `customer's accepted terms` })
  readonly accepted_terms?: boolean;
}

export class CreateEmployeeProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `employee's full name` })
  readonly full_name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `employee's phone` })
  readonly phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `employee's profile picture URL` })
  readonly profile_picture?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `employee's department` })
  readonly department?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `employee's position` })
  readonly position?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `employee's age` })
  readonly age?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `employee's city_id` })
  readonly city_id?: number;
}

export class CreateCustomerProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `customer's full name` })
  readonly full_name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `customer's phone` })
  readonly phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `customer's profile picture URL` })
  readonly profile_picture?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `customer's age` })
  readonly age?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `customer's city_id` })
  readonly city_id?: number;

  @IsOptional()
  @ApiProperty({ description: `customer's accepted terms` })
  readonly accepted_terms?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
