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
import { UpdateTodoItemAdminDto } from './dto/update-todo-item-admin.dto';
import { TodoItemEntity } from './entities/todo-item.entity';
import { ReturnTodoItemDto } from './dto/return-todo-item.dto';

/**
 * TodoItemsService handles the business logic for todo resources.
 * It interacts with the TypeORM repository to perform CRUD operations
 * and ensures data integrity and authorization.
 */
@Injectable()
export class TodoItemsService {
  private readonly logger = new Logger(TodoItemsService.name);

  constructor(
    @InjectRepository(TodoItemEntity)
    private readonly repo: Repository<TodoItemEntity>,
  ) {}

  // region private helper methods
  /**
   * Maps a TodoItemEntity to a ReturnTodoItemDto.
   *
   * @param {number} corrId - Correlation ID for tracing.
   * @param {TodoItemEntity} entity - The database entity.
   * @returns {ReturnTodoItemDto} The mapped DTO.
   */
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

  /**
   * Internal helper to find an entity by ID or throw a NotFoundException.
   *
   * @param {number} id - The unique identifier of the todo.
   * @param {number} corrId - Correlation ID for tracing.
   * @throws {NotFoundException} If no entity is found.
   */
  private async findEntity(
    id: number,
    corrId: number,
  ): Promise<TodoItemEntity> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.debug(`${corrId} findEntity: Todo ${id} not found`);
      throw new NotFoundException(`Todo with ID ${id} does not exist`);
    }
    return entity;
  }
  // endregion

  // region resource management
  /**
   * Creates a new todo item.
   */
  async create(
    dto: CreateTodoItemDto,
    corrId: number,
    userId: number,
  ): Promise<ReturnTodoItemDto> {
    const existing = await this.repo.findOneBy({ title: dto.title });
    if (existing) {
      throw new ConflictException('A todo with this title already exists');
    }

    const entity = this.repo.create({
      ...dto,
      createdById: userId,
      updatedById: userId,
    });
    const saved = await this.repo.save(entity);
    return this.entityToDto(corrId, saved);
  }

  /**
   * Retrieves all todo items. Admins see everything, users see only their own.
   */
  async findAll(
    corrId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<ReturnTodoItemDto[]> {
    let items: TodoItemEntity[];

    if (isAdmin) {
      // 1.8.1.3: Admin darf alle Ressourcen sehen
      items = await this.repo.find();
    } else {
      // 1.8.1.2: User darf nur auf sich selbst (seine Items) zugreifen
      items = await this.repo.find({
        where: { createdById: userId },
      });
    }

    return items.map((item) => this.entityToDto(corrId, item));
  }

  async findOne(
    id: number,
    corrId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<ReturnTodoItemDto> {
    const entity = await this.findEntity(id, corrId);

    // KORREKTUR: Wenn es kein Admin ist UND das Todo nicht dem User gehört -> 403
    if (!isAdmin && entity.createdById !== userId) {
      throw new ForbiddenException('Not allowed to view this todo');
    }

    return this.entityToDto(corrId, entity);
  }
  /**
   * Replaces an entire todo resource (1.2.5 PUT).
   */
  async replace(
    id: number,
    dto: CreateTodoItemDto,
    corrId: number,
    userId: number,
  ): Promise<ReturnTodoItemDto> {
    const existing = await this.findEntity(id, corrId);
    if (existing.createdById !== userId) {
      throw new ForbiddenException('No permission to replace this todo');
    }

    const updated = await this.repo.save({
      ...existing,
      ...dto,
      id: id,
      updatedById: userId,
    });
    return this.entityToDto(corrId, updated);
  }

  /**
   * Partially updates a todo resource (1.2.6 PATCH).
   * Richtlinie 1.8.1.2: Nur der Besitzer darf patchen.
   */
  async update(
    id: number,
    dto: UpdateTodoItemDto,
    corrId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<ReturnTodoItemDto> {
    const existing = await this.findEntity(id, corrId);

    // Richtlinie 1.8.1.2: Nur Besitzer oder Admin dürfen patchen
    if (!isAdmin && existing.createdById !== userId) {
      throw new ForbiddenException('No permission to update this todo');
    }

    await this.repo.update(id, { ...dto, updatedById: userId });
    const updated = await this.findEntity(id, corrId);
    return this.entityToDto(corrId, updated);
  }

  /**
   * Administrative update for a todo item (1.2.1 PATCH admin).
   * Richtlinie: Admin darf isClosed setzen.
   */
  async updateByAdmin(
    id: number,
    corrId: number,
    adminId: number,
    adminDto: UpdateTodoItemAdminDto,
  ): Promise<ReturnTodoItemDto> {
    // 1. Existenz prüfen (wirft 404, wenn nicht vorhanden)
    const existingEntity = await this.findEntity(id, corrId);

    // 2. Update via save (besser für Admin-Updates mit isClosed)
    const updatedEntity = await this.repo.save({
      ...existingEntity,
      ...adminDto, // Hier steckt isClosed drin
      updatedById: adminId,
      id: id, // Sicherstellen, dass die ID gleich bleibt
    });

    this.logger.log(
      `${corrId} Admin ${adminId} updated Todo ${id} (isClosed: ${adminDto.isClosed})`,
    );

    return this.entityToDto(corrId, updatedEntity);
  }

  /**
   * Removes a todo item (1.2.7 DELETE).
   */
  async remove(
    id: number,
    corrId: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<ReturnTodoItemDto> {
    // 1. Prüfen, ob das Todo überhaupt existiert (wirft 404 falls nicht)
    const existing = await this.findEntity(id, corrId);

    // 2. Berechtigung prüfen (Richtlinie 1.8.1.2)
    // Wenn NICHT Admin UND NICHT der Besitzer -> 403 Forbidden
    if (!isAdmin && existing.createdById !== userId) {
      this.logger.warn(
        `${corrId} User ${userId} tried to delete Todo ${id} without permission`,
      );
      throw new ForbiddenException('Deletion not permitted');
    }

    // 3. Zuerst das DTO vorbereiten (solange das Objekt noch in der DB ist)
    const returnDto = this.entityToDto(corrId, existing);

    // 4. Dann löschen
    await this.repo.remove(existing);

    this.logger.log(
      `${corrId} Todo ${id} deleted by ${isAdmin ? 'Admin' : 'User'} ${userId}`,
    );

    return returnDto;
  }

  async updateUser(
    id: number,
    dto: UpdateTodoItemDto,
    corrId: number,
  ): Promise<ReturnTodoItemDto> {
    // 1. Preload: Findet Entity und merged die DTO-Daten
    const todo = await this.repo.preload({
      id: id,
      ...dto,
    });

    // 2. Fehlerprüfung (Löst deinen NotFoundException Fehler)
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }

    // 3. Speichern
    const updatedTodo = await this.repo.save(todo);

    // 4. Mapping (Löst deinen entityToDto Fehler)
    return this.entityToDto(corrId, updatedTodo);
  }
}
