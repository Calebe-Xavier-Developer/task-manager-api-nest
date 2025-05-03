import { Priority, Status } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsString()
    @IsNotEmpty()
    columnId: string;
}