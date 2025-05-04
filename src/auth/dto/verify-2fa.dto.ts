import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";


export class Verify2faDto {
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ example: 'UUID-2fa-token' })
    @IsString()
    @Length(6, 6)
    code: string;
}