import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { UpdateTodoItemAdminDto } from './dto/update-todo-item-admin.dto';
import { TodoItemEntity } from './entities/todo-item.entity';
import { ReturnTodoItemDto } from './dto/return-todo-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodoItemsService {
  private readonly logger = new Logger(TodoItemsService.name);

  constructor(
    @InjectRepository(TodoItemEntity)
    private readonly repo: Repository<TodoItemEntity>,
  ) {}

  // Hilfsmethode: Wandelt Entity in DTO um
  private entityToDto(
    corrId: number,
    entity: TodoItemEntity,
  ): ReturnTodoItemDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      isClosed: entity.isClosed,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      version: entity.version,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    };
  }

  // NEU: Interne Methode, die das echte Entity zurückgibt
  private async findEntity(
    id: number,
    corrId: number,
  ): Promise<TodoItemEntity> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.debug(`${corrId} findEntity id: ${id} not found`);
      throw new NotFoundException(`Todo item ${id} not found`);
    }
    return entity;
  }

  // Öffentliche Methode für den Controller (liefert DTO)
  async findOne(id: number, corrId: number): Promise<ReturnTodoItemDto> {
    const entity = await this.findEntity(id, corrId);
    return this.entityToDto(corrId, entity);
  }

  async create(dto: CreateTodoItemDto, corrId: number, todoId: number) {
    const entity = this.repo.create({
      ...dto,
      createdById: todoId,
      updatedById: todoId,
    });
    const saved = await this.repo.save(entity);
    return this.entityToDto(corrId, saved);
  }

  async findAll(corrId: number) {
    const items = await this.repo.find();
    return items.map((item) => this.entityToDto(corrId, item));
  }

  // 1.2.5 Replace
  async replace(
    id: number,
    dto: CreateTodoItemDto,
    corrId: number,
    todoId: number,
  ) {
    const existing = await this.findEntity(id, corrId); // Nutze findEntity!
    if (existing.createdById !== todoId) throw new ForbiddenException();

    // Hier mischen wir die Daten in ein neues Objekt für .save()
    const updated = await this.repo.save({
      ...existing,
      ...dto,
      id: id,
      updatedById: todoId,
    });
    return this.entityToDto(corrId, updated);
  }

  // 1.2.6 Update
  async update(
    id: number,
    dto: UpdateTodoItemDto,
    corrId: number,
    todoId: number,
  ) {
    const existing = await this.findEntity(id, corrId); // Nutze findEntity!
    if (existing.createdById !== todoId) throw new ForbiddenException();

    await this.repo.update(id, { ...dto, updatedById: todoId });
    const updated = await this.findEntity(id, corrId);
    return this.entityToDto(corrId, updated);
  }

  // 1.2.7 Delete
  async remove(id: number, corrId: number, todoId: number, isAdmin: boolean) {
    const existing = await this.findEntity(id, corrId); // Nutze findEntity!

    if (!isAdmin && existing.createdById !== todoId) {
      throw new ForbiddenException();
    }

    const deleted = await this.repo.remove(existing); // Jetzt ist es ein Entity!
    return this.entityToDto(corrId, deleted);
  }

  async updateByAdmin(
    id: number,
    todoId: number,
    corrId: number,
    adminDto: UpdateTodoItemAdminDto,
  ) {
    const existing = await this.findEntity(id, corrId);
    const updated = await this.repo.save({
      ...existing,
      ...adminDto,
      updatedById: todoId,
      id,
    });
    return this.entityToDto(corrId, updated);
  }
}
