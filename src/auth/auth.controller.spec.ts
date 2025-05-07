import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';

const mockAuthService = {
  singUp: jest.fn(),
  login: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  verify2fa: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should call authService.singUp with CreateUserDto', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      phone: '123456789',
    };

    await controller.signUp(dto);
    expect(mockAuthService.singUp).toHaveBeenCalledWith(dto);
  });

  it('should call authService.login with LoginDto', async () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };

    await controller.login(dto);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('should call authService.forgotPassword with ForgotPasswordDto', async () => {
    const emailDto: ForgotPasswordDto = {
      email: 'test@example.com',
    };

    await controller.forgotPassword(emailDto);
    expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(emailDto);
  });

  it('should call authService.resetPassword with ResetPasswordDto', async () => {
    const dto: ResetPasswordDto = {
      token: 'reset-token',
      newPassword: 'newPass123',
    };

    await controller.resetPassword(dto);
    expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
  });

  it('should call authService.verify2fa with Verify2faDto', async () => {
    const dto: Verify2faDto = {
      email: 'test@example.com',
      code: '123456',
    };

    await controller.verify2fa(dto);
    expect(mockAuthService.verify2fa).toHaveBeenCalledWith(dto);
  });
});
