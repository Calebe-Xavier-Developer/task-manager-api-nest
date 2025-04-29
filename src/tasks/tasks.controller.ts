import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Req() req, @Body() dto: CreateTaskDto) {
        return this.tasksService.create(req.user.userId, dto);
    }

    @Get()
    findAll(@Req() req) {
        return this.tasksService.findAll(req.user.userId);
    }

    @Patch(':id')
    update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTaskDto){
        return this.tasksService.update(req.user.userId, id, dto);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.tasksService.remove(req.user.userId, id);
    }
}
