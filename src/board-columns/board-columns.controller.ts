import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { BoardColumnsService } from './board-columns.service';
import { AuthGuard } from '@nestjs/passport';
import { ReorderBoardColumnsDto } from './dto/reorder-board-columns.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('board-columns')
export class BoardColumnsController {
  constructor(private readonly service: BoardColumnsService) {}

    @Post()
    create(@Req() req, @Body() dto: CreateBoardColumnDto) {
        return this.service.create(req.user.userId, dto);
    }

    @Patch('reorder')
    reorder(@Req() req, @Body() dto: ReorderBoardColumnsDto) {
        return this.service.reorder(req.user.userId, dto);
    }
}
