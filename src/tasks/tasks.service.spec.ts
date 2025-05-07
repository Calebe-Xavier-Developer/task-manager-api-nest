import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockTask = {
  id: 'task-id',
  title: 'Test Task',
  description: 'Task desc',
  priority: 'medium',
  status: 'todo',
  dueDate: new Date(),
  userId: 'user-id',
};

const mockColumnTask = {
  columnId: 'column-id',
  taskId: 'task-id',
  position: 0,
};

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            columnTask: {
              count: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              updateMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a task and columnTask', async () => {
    (prisma.task.create as jest.Mock).mockResolvedValueOnce(mockTask);
    (prisma.columnTask.count as jest.Mock).mockResolvedValueOnce(0);
    (prisma.columnTask.create as jest.Mock).mockResolvedValueOnce(mockColumnTask);

    await expect(
      service.create('user-id', {
        columnId: 'column-id',
        title: 'Test Task',
        description: 'desc',
      })
    ).resolves.toBeUndefined();
  });

  it('should find all tasks for a user', async () => {
    (prisma.task.findMany as jest.Mock).mockResolvedValueOnce([mockTask]);
    const result = await service.findAll('user-id');
    expect(result).toEqual([mockTask]);
  });

  it('should update a task', async () => {
    (prisma.task.update as jest.Mock).mockResolvedValueOnce(mockTask);
    const result = await service.update('task-id', {
      title: 'Updated',
      description: 'Updated',
      priority: 'high',
      status: 'done',
    });
    expect(result).toEqual(mockTask);
  });

  it('should reorder tasks', async () => {
    (prisma.columnTask.findMany as jest.Mock).mockResolvedValueOnce([mockColumnTask]);
    (prisma.$transaction as jest.Mock).mockResolvedValueOnce([]);
    const result = await service.reorderTasks({
      columnId: 'column-id',
      orderedTaskIds: ['task-id'],
    });
    expect(result).toEqual({ message: 'Tasks reordered successfully' });
  });

  it('should throw if tasks do not belong to column', async () => {
    (prisma.columnTask.findMany as jest.Mock).mockResolvedValueOnce([]);
    await expect(
      service.reorderTasks({
        columnId: 'column-id',
        orderedTaskIds: ['task-id'],
      })
    ).rejects.toThrow('Some tasks do not belong to this column');
  });

  it('should remove a task and reorder remaining', async () => {
    (prisma.columnTask.findUnique as jest.Mock).mockResolvedValueOnce({
      ...mockColumnTask,
      position: 0,
    });
    (prisma.columnTask.delete as jest.Mock).mockResolvedValueOnce({});
    (prisma.columnTask.updateMany as jest.Mock).mockResolvedValueOnce({});
    (prisma.task.delete as jest.Mock).mockResolvedValueOnce({});

    const result = await service.remove('task-id', 'column-id');
    expect(result).toEqual({ message: 'Task deleted successfully' });
  });

  it('should throw if task to remove is not found', async () => {
    (prisma.columnTask.findUnique as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.remove('task-id', 'column-id')).rejects.toThrow(NotFoundException);
  });
});
