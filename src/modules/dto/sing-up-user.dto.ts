import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  Matches,
  IsOptional,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: `user's name` })
  readonly name: string;

  @IsString()
  @ApiProperty({ description: `user's last_name` })
  readonly lastName: string;

  @IsString()
  @Matches(/^\d{1,10}$/, {
    message:
      'Phone number must contain only digits and be up to 10 characters long.',
  })
  @ApiProperty({ description: `user's phone` })
  @IsOptional()
  readonly phone: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `user's email` })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `user's password` })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `user's user_name` })
  readonly userName: string;

  @IsNumber()
  @ApiProperty({ description: `user's id_role` })
  readonly idRole: number;
}

export class UpdateProductDto extends PartialType(CreateUserDto) {}
