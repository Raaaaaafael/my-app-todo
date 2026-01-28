import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { UpdateTodoItemAdminDto } from './dto/update-todo-item-admin.dto'; // Wichtig: Import hinzufügen
import { TodoItemEntity } from './entities/todo-item.entity';
import { ReturnTodoItemDto } from './dto/return-todo-item.dto';

@Injectable()
export class TodoItemsService {
  private readonly logger = new Logger(TodoItemsService.name);

  constructor(
    @InjectRepository(TodoItemEntity)
    private readonly repo: Repository<TodoItemEntity>,
  ) {}

  // Hilfsmethode für die Umwandlung in das geforderte ReturnTodoDto
  private entityToDto(
    corrId: number,
    entity: TodoItemEntity,
  ): ReturnTodoItemDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      isClosed: entity.isClosed,
      createdAt: entity.createdAt.toISOString(), // Wandelt Date in String für DTO um
      updatedAt: entity.updatedAt.toISOString(),
      version: entity.version,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    };
  }

  // Interne Methode liefert das echte Entity-Objekt für DB-Operationen
  private async findEntity(
    id: number,
    corrId: number,
  ): Promise<TodoItemEntity> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.debug(`${corrId} findEntity: Todo ${id} nicht gefunden`);
      throw new NotFoundException(`Todo mit ID ${id} existiert nicht`);
    }
    return entity;
  }

  async create(dto: CreateTodoItemDto, corrId: number, userId: number) {
    const existing = await this.repo.findOneBy({ title: dto.title });
    if (existing)
      throw new ConflictException(
        'Ein Todo mit diesem Titel existiert bereits',
      );

    const entity = this.repo.create({
      ...dto,
      createdById: userId,
      updatedById: userId,
    });
    const saved = await this.repo.save(entity);
    return this.entityToDto(corrId, saved);
  }

  async findAll(corrId: number) {
    const items = await this.repo.find();
    return items.map((item) => this.entityToDto(corrId, item));
  }

  async findOne(id: number, corrId: number) {
    const entity = await this.findEntity(id, corrId);
    return this.entityToDto(corrId, entity);
  }

  // 1.2.5 [PUT] Replace Todo
  async replace(
    id: number,
    dto: CreateTodoItemDto,
    corrId: number,
    userId: number,
  ) {
    const existing = await this.findEntity(id, corrId);
    if (existing.createdById !== userId)
      throw new ForbiddenException('Kein Zugriff auf dieses Todo');

    const updated = await this.repo.save({
      ...existing,
      ...dto,
      id: id,
      updatedById: userId,
    });
    return this.entityToDto(corrId, updated);
  }

  // 1.2.6 [PATCH] Update Todo
  async update(
    id: number,
    dto: UpdateTodoItemDto,
    corrId: number,
    userId: number,
  ) {
    const existing = await this.findEntity(id, corrId);
    if (existing.createdById !== userId) throw new ForbiddenException();

    await this.repo.update(id, { ...dto, updatedById: userId });
    const updated = await this.findEntity(id, corrId);
    return this.entityToDto(corrId, updated);
  }

  // --- NEU: Diese Methode hat dir gefehlt ---
  // [PATCH] Update Todo as Admin
  async updateByAdmin(
    id: number,
    corrId: number,
    adminId: number,
    adminDto: UpdateTodoItemAdminDto,
  ): Promise<ReturnTodoItemDto> {
    const existingEntity = await this.findEntity(id, corrId);

    const updatedEntity = await this.repo.save({
      ...existingEntity,
      ...adminDto,
      updatedById: adminId, // Protokolliert, welcher Admin die Änderung vornahm
      id: id,
    });

    this.logger.log(`${corrId} Admin-Update für Todo ${id} durchgeführt.`);
    return this.entityToDto(corrId, updatedEntity);
  }

  // 1.2.7 [DELETE] Delete Todo
  async remove(id: number, corrId: number, userId: number, isAdmin: boolean) {
    const existing = await this.findEntity(id, corrId);

    if (!isAdmin && existing.createdById !== userId) {
      throw new ForbiddenException('Löschen nicht erlaubt');
    }

    const deleted = await this.repo.remove(existing);
    return this.entityToDto(corrId, deleted);
  }
}
