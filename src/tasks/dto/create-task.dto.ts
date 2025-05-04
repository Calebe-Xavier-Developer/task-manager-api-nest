import { ApiProperty } from "@nestjs/swagger";
import { Priority, Status } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateTaskDto {
    @ApiProperty({ example: 'Create login page' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Design and implement login page using React' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: Priority, example: Priority.medium })
    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;

    @ApiProperty({ enum: Status, example: Status.todo })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @ApiProperty({ example: 'column-uuid' })
    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @ApiProperty({ example: '2025-06-01T00:00:00.000Z' })
    @IsString()
    @IsNotEmpty()
    columnId: string;
}