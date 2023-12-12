import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class UsersDto {
  @IsString()
  @ApiProperty({ description: `user's name` })
  readonly name: string;

  @IsString()
  @ApiProperty({ description: `user's last_name` })
  readonly last_name: string;

  @IsString()
  @Matches(/^\d{1,10}$/, {
    message:
      'Phone number must contain only digits and be up to 10 characters long.',
  })
  @ApiProperty({ description: `user's phone` })
  readonly phone: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: `user's email` })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `user's password` })
  readonly password: string;
}

export class UpdateUserDto extends PartialType(UsersDto) {}
