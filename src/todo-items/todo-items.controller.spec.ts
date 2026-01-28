import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsController } from './todo-items.controller';
import { TodoItemsService } from './todo-items.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../modules/auth/services/user.service';

describe('TodoItemsController', () => {
  let controller: TodoItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsController],
      providers: [
        // Wir nutzen useValue, um den echten Service durch ein Mock-Objekt zu ersetzen
        {
          provide: TodoItemsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test' }),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
        // Mocks für den AuthGuard
        { provide: JwtService, useValue: { verify: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: UserService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    controller = module.get<TodoItemsController>(TodoItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
