import { ArrayNotEmpty, IsArray, IsInt, IsUUID } from "class-validator";


export class ReorderTaskDto {
    @IsUUID()
    columnId: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    orderedTaskIds: string[];

}