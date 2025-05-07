import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ColumnsController', () => {
  let controller: ColumnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnsController],
      providers: [{ provide: ColumnsService, useValue: mockService }],
    }).compile();

    controller = module.get<ColumnsController>(ColumnsController);
  });

  it('should call create with correct parameters', async () => {
    await controller.create({ user: { userId: 'user-1' } }, { title: 'Col' });
    expect(mockService.create).toHaveBeenCalledWith('user-1', { title: 'Col' });
  });

  it('should return all columns', async () => {
    mockService.findAll.mockResolvedValueOnce([]);
    const result = await controller.findAll({ user: { userId: 'user-1' } });
    expect(result).toEqual([]);
  });

  it('should call update with correct parameters', async () => {
    await controller.update({ user: { userId: 'user-1' } }, 'col-1', { title: 'Update' });
    expect(mockService.update).toHaveBeenCalledWith('user-1', 'col-1', { title: 'Update' });
  });

  it('should call remove with correct id', async () => {
    await controller.remove('col-1');
    expect(mockService.remove).toHaveBeenCalledWith('col-1');
  });
});
