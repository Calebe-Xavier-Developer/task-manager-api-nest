import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
              update: jest.fn(),
            },
            passwordResetToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
            twoFAToken: {
              create: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
            },
          }
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should sign up if email is not in use', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-password');
    jest.spyOn(prisma.user, 'create').mockResolvedValueOnce({ id: mockUser.id, email: mockUser.email } as any);
    jest.spyOn(jwt, 'signAsync').mockResolvedValueOnce('mocked-token');
  
    const result = await service.signUp({
      email: mockUser.email,
      password: mockUser.password,
      name: mockUser.name,
      phone: mockUser.phone
    });
  
    expect(result.access_token).toBe('mocked-token');
  });  

  it('should throw if email is already in use', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser as any);

    await expect(service.signUp({
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

  it('should verify 2FA and return access token', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser as any);
    jest.spyOn(prisma.twoFAToken, 'findFirst').mockResolvedValueOnce({
      id: '2fa-id',
      userId: mockUser.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60000),
      code: '123456',
    });
    
    jest.spyOn(prisma.twoFAToken, 'delete').mockResolvedValueOnce({
      id: '2fa-id',
      userId: mockUser.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60000),
      code: '123456',
    });
    
    jest.spyOn(jwt, 'signAsync').mockResolvedValueOnce('verified-token');
  
    const result = await service.verify2fa({
      email: mockUser.email,
      code: '123456',
    });
  
    expect(result.access_token).toBe('verified-token');
  });

  it('should throw if 2FA token is invalid or expired', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser as any);
    jest.spyOn(prisma.twoFAToken, 'findFirst').mockResolvedValueOnce(null);
  
    await expect(
      service.verify2fa({ email: mockUser.email, code: 'wrong-code' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw if user not found when verifying 2FA', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
  
    await expect(
      service.verify2fa({ email: 'notfound@email.com', code: '123456' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should generate a reset token if user exists', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser as any);
    jest.spyOn(prisma.passwordResetToken, 'create').mockResolvedValueOnce({} as any);
  
    const result = await service.forgotPassword({ email: mockUser.email });
  
    expect(result.message).toBe('Recovery instructions sent to your email (mocked).');
  });

  it('should throw if user does not exist on forgotPassword', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
  
    await expect(service.forgotPassword({ email: mockUser.email }))
      .rejects.toThrow(NotFoundException);
  });

  it('should reset password if token is valid', async () => {
    const tokenData = {
      token: 'valid-token',
      userId: mockUser.id,
      expiresAt: new Date(Date.now() + 100000),
      user: mockUser,
    };
  
    jest.spyOn(prisma.passwordResetToken, 'findUnique').mockResolvedValueOnce(tokenData as any);
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-new-password');
    jest.spyOn(prisma.user, 'update').mockResolvedValueOnce({} as any);
    jest.spyOn(prisma.passwordResetToken, 'delete').mockResolvedValueOnce({} as any);
  
    const result = await service.resetPassword({
      token: 'valid-token',
      newPassword: 'new-password',
    });
  
    expect(result.message).toBe('Password updated successfully');
  });  

  it('should throw if token is invalid or expired', async () => {
    jest.spyOn(prisma.passwordResetToken, 'findUnique').mockResolvedValueOnce(null);
  
    await expect(service.resetPassword({
      token: 'invalid-token',
      newPassword: 'new-password',
    })).rejects.toThrow(ForbiddenException);
  });

  it('should trigger 2FA if enabled on user', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      ...mockUser,
      is2FAEnabled: true,
    } as any);
  
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    jest.spyOn(prisma.twoFAToken, 'create').mockResolvedValueOnce({} as any);
  
    const result = await service.login({
      email: mockUser.email,
      password: mockUser.password,
    });
  
    expect(result).toEqual({
      message: '2FA code sent to your email (mocked).',
    });
  });
});
