import { Test, TestingModule } from '@nestjs/testing';
import { BoardColumnsService } from './board-columns.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  column: {
    create: jest.fn(),
  },
  boardColumn: {
    count: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
  board: {
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('BoardColumnsService', () => {
  let service: BoardColumnsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardColumnsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<BoardColumnsService>(BoardColumnsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should create a column and add it to board', async () => {
    mockPrisma.column.create.mockResolvedValueOnce({ id: 'col-1' });
    mockPrisma.boardColumn.count.mockResolvedValueOnce(0);
    mockPrisma.boardColumn.create.mockResolvedValueOnce(undefined);

    const result = await service.create('user-1', {
      boardId: 'board-1',
      title: 'New Column',
    });

    expect(mockPrisma.column.create).toHaveBeenCalled();
    expect(mockPrisma.boardColumn.count).toHaveBeenCalledWith({ where: { boardId: 'board-1' } });
    expect(mockPrisma.boardColumn.create).toHaveBeenCalledWith({
      data: {
        boardId: 'board-1',
        columnId: 'col-1',
        position: 0,
      },
    });
    expect(result).toEqual({ message: 'Column created and added to board', columnId: 'col-1' });
  });

  it('should reorder columns if user has access to board', async () => {
    mockPrisma.board.findFirst.mockResolvedValueOnce({ id: 'board-1', userId: 'user-1' });
    mockPrisma.$transaction.mockResolvedValueOnce(undefined);

    const result = await service.reorder('user-1', {
      boardId: 'board-1',
      columnIds: ['col-1', 'col-2'],
    });

    expect(mockPrisma.board.findFirst).toHaveBeenCalledWith({
      where: { id: 'board-1', userId: 'user-1' },
    });
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Columns reordered successfully' });
  });

  it('should throw if user has no access to board', async () => {
    mockPrisma.board.findFirst.mockResolvedValueOnce(null);

    await expect(
      service.reorder('user-1', {
        boardId: 'board-1',
        columnIds: ['col-1', 'col-2'],
      })
    ).rejects.toThrow(ForbiddenException);
  });
});
