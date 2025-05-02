import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { BoardsService } from './boards.service';
  import { CreateBoardDto } from './dto/create-board.dto';
  import { UpdateBoardDto } from './dto/update-board.dto';
  import { AuthGuard } from '@nestjs/passport';
  
  @UseGuards(AuthGuard('jwt'))
  @Controller('boards')
  export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}
  
    @Post()
    create(@Req() req, @Body() dto: CreateBoardDto) {
      return this.boardsService.create(req.user.userId, dto);
    }
  
    @Get()
    findAll(@Req() req) {
      return this.boardsService.findAll(req.user.userId);
    }
  
    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
      return this.boardsService.findOne(req.user.userId, id);
    }
  
    @Patch(':id')
    update(@Req() req, @Param('id') id: string, @Body() dto: UpdateBoardDto) {
      return this.boardsService.update(req.user.userId, id, dto);
    }
  
    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
      return this.boardsService.remove(req.user.userId, id);
    }
  }
  