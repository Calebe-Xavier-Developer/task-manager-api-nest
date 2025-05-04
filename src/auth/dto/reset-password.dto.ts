import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'UUID-token-reset' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'newpassword123' })
  @MinLength(6)
  newPassword: string;
}
