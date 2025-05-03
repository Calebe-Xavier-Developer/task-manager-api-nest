import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

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
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto){
        return this.tasksService.update(id, dto);
    }

    @Patch('reorder')
    reorderTasks(@Body() dto: ReorderTaskDto) {
        return this.tasksService.reorderTasks(dto);
    }

    @Delete(':id/column/:columnId')
    remove(@Param('id') taskId: string, @Param('columnId') columnId: string,) {
        return this.tasksService.remove(taskId, columnId);
    }
}
