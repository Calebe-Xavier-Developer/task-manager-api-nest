import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

describe('BoardsController', () => {
  let controller: BoardsController;
  let service: BoardsService;

  const mockBoard = {
    id: '1',
    name: 'Project Board',
    userId: 'user-id',
    boardColumns: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockBoard),
    findAll: jest.fn().mockResolvedValue([mockBoard]),
    findOne: jest.fn().mockResolvedValue(mockBoard),
    update: jest.fn().mockResolvedValue({ count: 1 }),
    remove: jest.fn().mockResolvedValue({ count: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        { provide: BoardsService, useValue: mockService }
      ]
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
    service = module.get<BoardsService>(BoardsService);
  });

  it('should create a board', async () => {
    const dto: CreateBoardDto = { name: 'Project Board' };
    const result = await controller.create({ user: { userId: 'user-id' } }, dto);
    expect(service.create).toHaveBeenCalledWith('user-id', dto);
    expect(result).toEqual(mockBoard);
  });

  it('should get all boards', async () => {
    const result = await controller.findAll({ user: { userId: 'user-id' } });
    expect(service.findAll).toHaveBeenCalledWith('user-id');
    expect(result).toEqual([mockBoard]);
  });

  it('should get one board by id', async () => {
    const result = await controller.findOne({ user: { userId: 'user-id' } }, '1');
    expect(service.findOne).toHaveBeenCalledWith('user-id', '1');
    expect(result).toEqual(mockBoard);
  });

  it('should update a board', async () => {
    const dto: UpdateBoardDto = { name: 'Updated Name' };
    const result = await controller.update({ user: { userId: 'user-id' } }, '1', dto);
    expect(service.update).toHaveBeenCalledWith('user-id', '1', dto);
    expect(result).toEqual({ count: 1 });
  });

  it('should delete a board', async () => {
    const result = await controller.remove({ user: { userId: 'user-id' } }, '1');
    expect(service.remove).toHaveBeenCalledWith('user-id', '1');
    expect(result).toEqual({ count: 1 });
  });
});
