import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ColumnsModule } from './columns/columns.module';
import { BoardColumnsModule } from './board-columns/board-columns.module';

@Module({
  imports: [PrismaModule, AuthModule, TasksModule, ColumnsModule, BoardColumnsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
