import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateColumnDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsInt()
    position?: number;
}