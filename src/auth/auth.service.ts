import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

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
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new ForbiddenException('Invalid credentials');

        const match = await bcrypt.compare(dto.password, user.password);

        if (!match) throw new ForbiddenException('Invalid credentials');

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: string, email: string): Promise<{ access_token: string }> {
        const payload = { sub: userId, email };
        const token = await this.jwt.signAsync(payload);

        return { access_token: token };
    }

}
