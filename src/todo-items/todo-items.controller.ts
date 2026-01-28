import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TodoItemsService } from './todo-items.service';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { UpdateTodoItemAdminDto } from './dto/update-todo-item-admin.dto';
import { CorrId } from 'src/decorators/corr-id.decorator';
import { IsClosed, TodoId } from './decorators/decorators';
import { ReturnTodoItemDto } from './dto/return-todo-item.dto';

@ApiTags('todo')
@ApiBearerAuth()
@Controller('todo')
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @Post()
  create(
    @Body() createDto: CreateTodoItemDto,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
  ) {
    return this.todoItemsService.create(createDto, corrId, todoId);
  }

  @Get()
  findAll(@CorrId() corrId: number) {
    return this.todoItemsService.findAll(corrId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
    @IsClosed() isClosed: boolean,
  ) {
    const todo = await this.todoItemsService.findOne(id, corrId);
    // Security Check: Nur Admin oder Besitzer darf sehen
    if (!isClosed && todo.createdById !== todoId) {
      throw new ForbiddenException('Not allowed to view this todo');
    }
    return todo;
  }

  // 1.2.5 [PUT] Replace Todo
  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() replaceDto: CreateTodoItemDto, // PUT ersetzt meist alles
    @CorrId() corrId: number,
    @TodoId() todoId: number,
  ) {
    return this.todoItemsService.replace(id, replaceDto, corrId, todoId);
  }

  // 1.2.6 [PATCH] Update Todo
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTodoItemDto,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
  ) {
    return this.todoItemsService.update(id, updateDto, corrId, todoId);
  }

  // 1.2.7 [DELETE] Delete Todo
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
    @IsClosed() isClosed: boolean,
  ) {
    return this.todoItemsService.remove(id, corrId, todoId, isClosed);
  }

  // Admin Update (Zusatzroute aus deinem Code)
  @Patch(':id/admin')
  @ApiOperation({ summary: 'Update todo as admin' })
  async updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminDto: UpdateTodoItemAdminDto,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
  ): Promise<ReturnTodoItemDto> {
    // Der Controller ruft NUR den Service auf.
    // Er hat selbst kein 'repo', 'findEntity' oder 'entityToDto'.
    return await this.todoItemsService.updateByAdmin(
      id,
      corrId,
      todoId,
      adminDto,
    );
  }
}
