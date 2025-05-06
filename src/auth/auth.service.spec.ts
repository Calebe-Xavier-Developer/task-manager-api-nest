import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForbiddenException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const mockUser = {
  id: 'user-1',
  email: 'test@test.com',
  name: 'Test User',
  password: '@ADEW#$ASDW2dfasdads',
  phone: '1234567890',
}

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        JwtService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn()
            },
            passwordResetToken: {
              create: jest.fn(),
              findUnique: jest.fn()
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should throe if email is already in use', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser as any);

    await expect(service.singUp({
      email: mockUser.email,
      password: mockUser.password,
      name: mockUser.name,
      phone: mockUser.phone
    })).rejects.toThrow(ForbiddenException)
  });

  it('should login if credential are valid', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({ ...mockUser as any });  
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    jest.spyOn(jwt, 'signAsync').mockResolvedValueOnce('mocked-token');

    const result = await service.login({
      email: mockUser.email,
      password: mockUser.password,
    }) as { access_token: string };

    expect(result.access_token).toBe('mocked-token');

  });

  it('should throw if password is invalid', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser as any);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      service.login({ email: mockUser.email, password: 'wrong' })).rejects.toThrow(
      ForbiddenException,
    );
  });
});
