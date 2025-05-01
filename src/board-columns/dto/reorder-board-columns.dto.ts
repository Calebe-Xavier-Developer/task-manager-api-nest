import { IsArray, IsString } from 'class-validator';

export class ReorderBoardColumnsDto {
  @IsString()
  boardId: string;

  @IsArray()
  @IsString({ each: true })
  columnIds: string[];
}
