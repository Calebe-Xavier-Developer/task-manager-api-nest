import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                priority: dto.priority,
                status: dto.status,
                dueDate: dto.dueDate,
                columnId: dto.columnId,
                userId: userId,
            }
        })
    }

    async findAll(userId: string) {
        return this.prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(userId: string, taskId: string, dto: UpdateTaskDto) {
        const task = await this.prisma.task.findUnique({
            where: {id: taskId, userId}
        })

        if (!task) throw new ForbiddenException('Task not found');

        return this.prisma.task.update({
            where: { id: taskId, userId },
            data: dto,
        });
    }

    async remove(userId: string, taskId: string) {
        const task = await this.prisma.task.findUnique({
            where: {id: taskId, userId}
        })

        if (!task) throw new ForbiddenException('Task not found');

        return this.prisma.task.delete({
            where: { id: taskId, userId },
        });
    }
}
