import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItemsService } from './todo-items.service';
import { TodoItemsController } from './todo-items.controller';
import { TodoSeedService } from './seed/todo-seed.service';
import { TodoItemEntity } from './entities/todo-item.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

/**
 * TodoItemsModule encapsulates all logic related to todo items.
 * It coordinates the database access, service logic, and the REST controller.
 */
@Module({
  imports: [
    // Register the TodoItemEntity for use within this module
    TypeOrmModule.forFeature([TodoItemEntity]),
    // Import AuthModule to handle authentication and user management
    AuthModule,
  ],
  controllers: [
    // Define the API entry points
    TodoItemsController,
  ],
  providers: [
    // Define business logic and data seeding services
    TodoItemsService,
    TodoSeedService,
  ],
  exports: [
    // Export the service if other modules need to access todo logic
    TodoItemsService,
  ],
})
export class TodoItemsModule {}
