import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateBoardDto) {
        return this.prisma.board.create({
            data: {
                name: dto.name,
                userId,
            }
        })
    }

    async findAll(userId: string) {
        return this.prisma.board.findMany({
            where: { userId },
            include: {
                boardColumns: {
                    include: { column: true },
                    orderBy: { position: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        })
    }

    async findOne(userId: string, id: string) {
        const board = await this.prisma.board.findFirst({
            where: { id, userId },
            include: {
                boardColumns: {
                    include: { column: true },
                    orderBy: { position: 'asc' },
                },
            },
        });

        if (!board) throw new NotFoundException('Board not found');
        return board;
    }


    async update(userId: string, id: string, dto: UpdateBoardDto) {
        return this.prisma.board.updateMany({
            where: { id, userId },
            data: dto,
        });
    }

    async remove(userId: string, id: string) {
        return this.prisma.board.deleteMany({
            where: { id, userId },
        });
    }

}
