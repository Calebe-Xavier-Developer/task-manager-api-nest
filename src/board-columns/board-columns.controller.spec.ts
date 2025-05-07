import { Test, TestingModule } from '@nestjs/testing';
import { BoardColumnsController } from './board-columns.controller';
import { BoardColumnsService } from './board-columns.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { ReorderBoardColumnsDto } from './dto/reorder-board-columns.dto';

const mockBoardColumnsService = {
  create: jest.fn(),
  reorder: jest.fn(),
};

describe('BoardColumnsController', () => {
  let controller: BoardColumnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardColumnsController],
      providers: [{ provide: BoardColumnsService, useValue: mockBoardColumnsService }],
    }).compile();

    controller = module.get<BoardColumnsController>(BoardColumnsController);
  });

  it('should create a board column', async () => {
    const dto: CreateBoardColumnDto = { title: 'Column', boardId: 'board-1' };
    await controller.create({ user: { userId: 'user-1' } }, dto);
    expect(mockBoardColumnsService.create).toHaveBeenCalledWith('user-1', dto);
  });

  it('should reorder board columns', async () => {
    const dto: ReorderBoardColumnsDto = {
      boardId: 'board-1',
      columnIds: ['col1', 'col2']
    };
    await controller.reorder({ user: { userId: 'user-1' } }, dto);
    expect(mockBoardColumnsService.reorder).toHaveBeenCalledWith('user-1', dto);
  });
});