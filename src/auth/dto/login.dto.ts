import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678' })
  @MinLength(6)
  password: string;
}
