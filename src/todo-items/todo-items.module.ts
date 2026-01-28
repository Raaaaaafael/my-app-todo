import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItemsService } from './todo-items.service';
import { TodoItemsController } from './todo-items.controller';
import { TodoSeedService } from './seed/todo-seed.service';
import { TodoItemEntity } from './entities/todo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItemEntity])],
  controllers: [TodoItemsController],
  providers: [TodoItemsService, TodoSeedService],
})
export class TodoItemsModule {}
