import { Status } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";


export enum TaskPriority {
    low = 'low',
    medium = 'medium',
    high = 'high',
}

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsString()
    columnId: string;
}