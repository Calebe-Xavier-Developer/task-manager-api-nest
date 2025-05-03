import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateTaskDto) {
        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                dueDate: dto.dueDate,
                priority: dto.priority || 'medium',
                status: dto.status || 'todo',
                userId,
            }
        });

        const count = await this.prisma.columnTask.count({
            where: { columnId: dto.columnId },
        });

        await this.prisma.columnTask.create({
            data: {
                columnId: dto.columnId,
                taskId: task.id,
                position: count,
            }
        })
    }

    async findAll(userId: string) {
        return this.prisma.task.findMany({
            where: { userId },
            include: { columnTask: { orderBy: { position: 'asc' } } },
        });
    }

    async update(taskId: string, dto: UpdateTaskDto) {
        return this.prisma.task.update({
            where: { id: taskId },
            data: {
            title: dto.title,
            description: dto.description,
            priority: dto.priority,
            status: dto.status,
            dueDate: dto.dueDate,
            },
        });
    }

    async reorderTasks(dto: ReorderTaskDto) {
        const { columnId, orderedTaskIds } = dto;

        const tasks = await this.prisma.columnTask.findMany({
            where: { columnId },
        });

        const foundTaskIds = tasks.map(t => t.taskId);

        const allBelongToColumn = orderedTaskIds.every(taskId => foundTaskIds.includes(taskId));

        if (!allBelongToColumn) {
            throw new Error('Some tasks do not belong to this column');
        }

        const updates = orderedTaskIds.map((taskId, index) => {
            return this.prisma.columnTask.update({
                where: { columnId_taskId: { columnId, taskId } },
                data: { position: index },
            })
        })

        await this.prisma.$transaction(updates);

        return {  message: 'Tasks reordered successfully' };
    }

    async remove(taskId: string, columnId: string) {
        const columnTask = await this.prisma.columnTask.findUnique({
            where: { 
                columnId_taskId: {
                    columnId,
                    taskId,
                }
             },
        });

        if (!columnTask) throw new NotFoundException('Task not found');

        await this.prisma.columnTask.delete({
            where: { columnId_taskId: {
                columnId: columnTask.columnId,
                taskId: columnTask.taskId,
            } },
        });

        await this.prisma.columnTask.updateMany({
            where: {
                columnId: columnTask.columnId,
                position: { gt: columnTask.position },
            },
            data: {
                position: { decrement: 1 },
            }
        })

        await this.prisma.task.delete({
            where: { id: taskId },
        });

        return { message: 'Task deleted successfully' };
    }
}
