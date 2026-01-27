import { Module } from '@nestjs/common';
import { TodoItemsService } from './todo-items.service';
import { TodoItemsController } from './todo-items.controller';

@Module({
  controllers: [TodoItemsController],
  providers: [TodoItemsService],
})
export class TodoItemsModule {}
