import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async singUp(dto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) throw new ForbiddenException('Email already in use');
        
        const hash = await bcrypt.hash(dto.password, 10);

        const user  = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hash,
                phone: dto.phone,
            },
        });

        return this.signToken(user.id, user.email);
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email }});
        if (!user) throw new ForbiddenException('Invalid credentials');

        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) throw new ForbiddenException('Invalid credentials');

        if (user.is2FAEnabled) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 300000);

            await this.prisma.twoFAToken.create({
                data: {
                    userId: user.id,
                    code,
                    expiresAt,
                },
            });

            console.log(`🔐 2FA code for ${dto.email}: ${code}`);

            return { message: '2FA code sent to your email (mocked).' };
        }

        return this.signToken(user.id, user.email);
    }

    async verify2fa(dto: Verify2faDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email }});
        if (!user) throw new NotFoundException('User not found');

        const tokenEntry = await this.prisma.twoFAToken.findFirst({
            where: { userId: user.id, code: dto.code, expiresAt: { gt: new Date() } },
        });

        if (!tokenEntry) throw new ForbiddenException('Invalid or expired 2FA code');

        await this.prisma.twoFAToken.delete({ where: { id: tokenEntry.id } });

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: string, email: string): Promise<{ access_token: string }> {
        const payload = { sub: userId, email };
        const token = await this.jwt.signAsync(payload);

        return { access_token: token };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const { email } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        const token = uuid();
        const expiresAt = new Date(Date.now() + 3600000);

        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt
            }
        })

        console.log(`🔐 Password reset token for ${email}: ${token}`);

        return { message: 'Recovery instructions sent to your email (mocked).' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const { token, newPassword } = dto;
        const resetEntry = await this.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetEntry || resetEntry.expiresAt < new Date()) {
            throw new ForbiddenException('Invalid or expired token');
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: resetEntry.userId },
            data: { password: hashed },
        });

        await this.prisma.passwordResetToken.delete({
            where: { token },
        });

        return { message: 'Password updated successfully' };
    }


}
