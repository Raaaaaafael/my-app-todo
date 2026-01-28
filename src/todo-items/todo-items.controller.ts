import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TodoItemsService } from './todo-items.service';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { ReturnTodoItemDto } from './dto/return-todo-item.dto';

@Controller('api/todo-items')
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @Post()
  create(@Body() createTodoItemDto: CreateTodoItemDto) {
    return this.todoItemsService.create(createTodoItemDto);
  }

  @Get()
  findAll() {
    return this.todoItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.todoItemsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() returnTodoItemDto: ReturnTodoItemDto,
  ) {
    return this.todoItemsService.update(+id, returnTodoItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.todoItemsService.remove(+id);
  }
}
