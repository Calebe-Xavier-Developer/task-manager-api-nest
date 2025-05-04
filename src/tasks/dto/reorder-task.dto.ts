import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderTaskDto {
  @ApiProperty({ example: 'column-uuid', description: 'ID da coluna onde as tarefas estão sendo reordenadas' })
  @IsUUID()
  columnId: string;

  @ApiProperty({
    example: ['task-id-1', 'task-id-2'],
    description: 'Array com os IDs das tarefas na nova ordem',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  orderedTaskIds: string[];
}