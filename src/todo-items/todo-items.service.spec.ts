import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemsService } from './todo-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoItemEntity } from './entities/todo-item.entity';

describe('TodoItemsService', () => {
  let service: TodoItemsService;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoItemsService,
        {
          provide: getRepositoryToken(TodoItemEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodoItemsService>(TodoItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
