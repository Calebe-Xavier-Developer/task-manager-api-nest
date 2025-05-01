import { IsNotEmpty, IsString } from "class-validator";


export class CreateBoardColumnDto {
    @IsString()
    @IsNotEmpty()
    boardId: string;

    @IsString()
    @IsNotEmpty()
    title: string;
}