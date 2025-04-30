import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateColumnDto) {
        let count = await this.prisma.column.count({ where: { userId } });

        return this.prisma.column.create({
            data: {
                title: dto.title,
                userId,
                position: count,
            }
        })
    }

    async findAll(userId: string) {
        return this.prisma.column.findMany({
            where: { userId },
            orderBy: { position: 'asc' }
        })
    }

    async update(userId: string, id: string, dto: UpdateColumnDto) {
        const column = await this.prisma.column.findFirst({ where: { id } });

        if (!column) throw new ForbiddenException('Column not found')

        return this.prisma.column.update({
            where: { id, userId },
            data: dto,
        })
    }

    async remove(id: string) {
        const column = await this.prisma.column.findFirst({ where: { id } });

        if (!column) throw new ForbiddenException('Column not found')

        return this.prisma.column.delete({where: { id }});

    }
}
