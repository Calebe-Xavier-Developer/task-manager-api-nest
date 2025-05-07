import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

const mockTasksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  reorderTasks: jest.fn(),
  remove: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should create a task', async () => {
    const dto: CreateTaskDto = { title: 'Test', columnId: 'col-1' } as any;
    await controller.create({ user: { userId: 'user-1' } }, dto);
    expect(mockTasksService.create).toHaveBeenCalledWith('user-1', dto);
  });

  it('should find all tasks', async () => {
    await controller.findAll({ user: { userId: 'user-1' } });
    expect(mockTasksService.findAll).toHaveBeenCalledWith('user-1');
  });

  it('should update a task', async () => {
    const dto: UpdateTaskDto = { title: 'Updated' } as any;
    await controller.update('task-1', dto);
    expect(mockTasksService.update).toHaveBeenCalledWith('task-1', dto);
  });

  it('should reorder tasks', async () => {
    const dto: ReorderTaskDto = {
      columnId: 'col-1',
      orderedTaskIds: ['task1', 'task2']
    };
    await controller.reorderTasks(dto);
    expect(mockTasksService.reorderTasks).toHaveBeenCalledWith(dto);
  });

  it('should delete a task', async () => {
    await controller.remove('task-1', 'col-1');
    expect(mockTasksService.remove).toHaveBeenCalledWith('task-1', 'col-1');
  });
});
