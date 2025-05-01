import { Module } from '@nestjs/common';
import { BoardColumnsService } from './board-columns.service';
import { BoardColumnsController } from './board-columns.controller';

@Module({
  providers: [BoardColumnsService],
  controllers: [BoardColumnsController]
})
export class BoardColumnsModule {}
