import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsService } from './columns.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  column: {
    create: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ColumnsService', () => {
  let service: ColumnsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColumnsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a column', async () => {
    mockPrisma.column.count.mockResolvedValueOnce(0);
    mockPrisma.column.create.mockResolvedValueOnce({ id: 'col-1' });

    const result = await service.create('user-1', { title: 'Column Title' });
    expect(result).toEqual({ id: 'col-1' });
  });

  it('should return all columns for user', async () => {
    mockPrisma.column.findMany.mockResolvedValueOnce([{ id: 'col-1' }, { id: 'col-2' }]);

    const result = await service.findAll('user-1');
    expect(result.length).toBe(2);
  });

  it('should update column if found', async () => {
    mockPrisma.column.findFirst.mockResolvedValueOnce({ id: 'col-1' });
    mockPrisma.column.update.mockResolvedValueOnce({ id: 'col-1', title: 'Updated' });

    const result = await service.update('user-1', 'col-1', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  it('should throw if column not found on update', async () => {
    mockPrisma.column.findFirst.mockResolvedValueOnce(null);

    await expect(service.update('user-1', 'col-1', { title: 'Updated' })).rejects.toThrow(ForbiddenException);
  });

  it('should delete column if found', async () => {
    mockPrisma.column.findFirst.mockResolvedValueOnce({ id: 'col-1' });
    mockPrisma.column.delete.mockResolvedValueOnce({ id: 'col-1' });

    const result = await service.remove('col-1');
    expect(result.id).toBe('col-1');
  });

  it('should throw if column not found on delete', async () => {
    mockPrisma.column.findFirst.mockResolvedValueOnce(null);

    await expect(service.remove('col-1')).rejects.toThrow(ForbiddenException);
  });
});