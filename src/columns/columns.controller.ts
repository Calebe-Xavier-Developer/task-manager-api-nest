import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('columns')
export class ColumnsController {
    constructor(private readonly columnService: ColumnsService) {}

    @Post()
    create(@Req() req, @Body() dto: CreateColumnDto) {
        return this.columnService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Req() req) {
        return this.columnService.findAll(req.user.userId);
    }

    @Patch(':id')
    update(@Req() req, @Param('id') id: string, @Body() dto: UpdateColumnDto) {
        return this.columnService.update(req.user.userId, id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.columnService.remove(id);
    }
}
