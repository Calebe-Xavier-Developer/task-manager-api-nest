import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockBoard = {
  id: '1',
  name: 'Project Board',
  userId: 'user-id',
  boardColumns: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BoardsService', () => {
  let service: BoardsService;
  let prisma: PrismaService;

  const prismaMock = {
    board: {
      create: jest.fn().mockResolvedValue(mockBoard),
      findMany: jest.fn().mockResolvedValue([mockBoard]),
      findFirst: jest.fn().mockResolvedValue(mockBoard),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a board', async () => {
    const result = await service.create('user-id', { name: 'Project Board' });
    expect(prisma.board.create).toHaveBeenCalledWith({
      data: { name: 'Project Board', userId: 'user-id' },
    });
    expect(result).toEqual(mockBoard);
  });

  it('should return all boards for user', async () => {
    const result = await service.findAll('user-id');
    expect(prisma.board.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      include: {
        boardColumns: {
          include: { column: true },
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([mockBoard]);
  });

  it('should return one board by id', async () => {
    const result = await service.findOne('user-id', '1');
    expect(prisma.board.findFirst).toHaveBeenCalledWith({
      where: { id: '1', userId: 'user-id' },
      include: {
        boardColumns: {
          include: { column: true },
          orderBy: { position: 'asc' },
        },
      },
    });
    expect(result).toEqual(mockBoard);
  });

  it('should throw if board not found', async () => {
    prisma.board.findFirst = jest.fn().mockResolvedValue(null);
    await expect(service.findOne('user-id', 'not-found')).rejects.toThrow(NotFoundException);
  });

  it('should update a board', async () => {
    const dto = { name: 'New Name' };
    const result = await service.update('user-id', '1', dto);
    expect(prisma.board.updateMany).toHaveBeenCalledWith({
      where: { id: '1', userId: 'user-id' },
      data: dto,
    });
    expect(result).toEqual({ count: 1 });
  });

  it('should delete a board', async () => {
    const result = await service.remove('user-id', '1');
    expect(prisma.board.deleteMany).toHaveBeenCalledWith({
      where: { id: '1', userId: 'user-id' },
    });
    expect(result).toEqual({ count: 1 });
  });
});
