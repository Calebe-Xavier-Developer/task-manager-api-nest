import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReorderBoardColumnsDto } from './dto/reorder-board-columns.dto';

@Injectable()
export class BoardColumnsService {
    constructor(private prisma: PrismaService) {}
    async create(userId: string, dto: CreateBoardColumnDto) {
        const column = await this.prisma.column.create({
            data: {
                title: dto.title,
                userId,
            }
        });

        const count = await this.prisma.boardColumn.count({ where: { boardId: dto.boardId } });

        await this.prisma.boardColumn.create({
            data: {
                boardId: dto.boardId,
                columnId: column.id,
                position: count,
            }
        })

        return { message: 'Column created and added to board', columnId: column.id };
    }

    async reorder(userId: string, dto: ReorderBoardColumnsDto) {
        const board = await this.prisma.board.findFirst({
          where: {
            id: dto.boardId,
            userId,
          },
        });
      
        if (!board) throw new ForbiddenException('Access denied to board');
      
        const updates = dto.columnIds.map((columnId, index) =>
          this.prisma.boardColumn.updateMany({
            where: {
              boardId: dto.boardId,
              columnId,
            },
            data: {
              position: index,
            },
          }),
        );
      
        await this.prisma.$transaction(updates);
        return { message: 'Columns reordered successfully' };
    }
      
}
