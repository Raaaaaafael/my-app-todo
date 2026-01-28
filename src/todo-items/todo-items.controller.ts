import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  ForbiddenException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TodoItemsService } from './todo-items.service';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemAdminDto } from './dto/update-todo-item-admin.dto';
import { ReturnTodoItemDto } from './dto/return-todo-item.dto';
import { CorrId } from 'src/decorators/corr-id.decorator';
import { IsClosed, TodoId } from './decorators/decorators';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { IsAdmin } from 'src/modules/auth/decorators';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';

/**
 * TodoItemsController provides RESTful API endpoints for managing tasks.
 * It handles the lifecycle of todo items including owner-based and admin-based operations.
 */
@ApiTags('todo')
@Controller('todo')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiInternalServerErrorResponse({
  description:
    'Internal Server Error\n\n[Referenz zu HTTP 500](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/500)',
})
@ApiUnauthorizedResponse({
  description:
    'Unauthorized, valid token required\n\n[Referenz zu HTTP 401](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/401)',
})
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  // region create a resource
  /**
   * Creates a new todo item for the authenticated user.
   *
   * @param {CreateTodoItemDto} createDto - Data for the new todo item.
   * @param {number} corrId - Unique correlation ID for request tracing.
   * @param {number} todoId - The ID of the authenticated user (from token).
   * @returns {Promise<ReturnTodoItemDto>} The created todo resource.
   */
  @Post()
  @ApiOperation({
    summary: 'Create todo',
    description: 'Create a new todo item resource',
  })
  @ApiCreatedResponse({
    type: ReturnTodoItemDto,
    description:
      'Return the created todo resource\n\n[Referenz zu HTTP 201](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/201)',
  })
  @ApiConflictResponse({
    description:
      'A todo with this title already exists\n\n[Referenz zu HTTP 409](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/409)',
  })
  @ApiBadRequestResponse({
    description:
      'Validation failed\n\n[Referenz zu HTTP 400](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/400)',
  })
  create(
    @Body() createDto: CreateTodoItemDto,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
  ): Promise<ReturnTodoItemDto> {
    return this.todoItemsService.create(createDto, corrId, todoId);
  }
  // endregion

  // region find resources
  /**
   * Retrieves all todo resources.
   *
   * @param {number} corrId - Correlation identifier.
   */
  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get all todos',
    description: 'Return an array of all todo resources',
  })
  @ApiOkResponse({
    type: ReturnTodoItemDto,
    isArray: true,
    description:
      'Array of todo resources\n\n[Referenz zu HTTP 200](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/200)',
  })
  findAll(
    @CorrId() corrId: number,
    @TodoId() todoId: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    const userId = todoId;
    return this.todoItemsService.findAll(corrId, userId, isAdmin);
  }
  /**
   * Retrieves a single todo by ID. Only accessible by owner or admin.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get todo by id',
    description: 'Return a single todo resource',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ReturnTodoItemDto })
  @ApiNotFoundResponse({
    description:
      'Todo not found\n\n[Referenz zu HTTP 404](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/404)',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden access\n\n[Referenz zu HTTP 403](https://developer.mozilla.org/de/docs/Web/HTTP/Reference/Status/403)',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
    @IsClosed() isClosed: boolean,
  ): Promise<ReturnTodoItemDto> {
    // 1. Todo holen
    const todo = await this.todoItemsService.findOne(
      id,
      corrId,
      todoId,
      isClosed,
    );

    // 2. Falls das Todo gar nicht existiert -> 404 (wichtig für Coverage!)
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }

    // 3. Security Check (Hier kommt dein 403 her!)
    // Prüfe genau: Entspricht todoId der ID des aktuellen Users?
    // Wenn das Todo "offen" ist (!isClosed), muss die ID übereinstimmen.
    if (!isClosed && todo.createdById !== todoId) {
      throw new ForbiddenException('Not allowed to view this todo');
    }

    // 4. Mapping (Damit die Response-Struktur dem Postman-Test entspricht)
    // Wir geben das Todo zurück, das nun den Titel "OpenUser" haben sollte.
    return todo;
  }
  // endregion

  // region update resources
  /**
   * Replaces an existing todo resource (Full Update).
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Replace todo',
    description: 'Full update of a todo resource',
  })
  @ApiOkResponse({ type: ReturnTodoItemDto })
  @ApiParam({ name: 'id', type: Number })
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() replaceDto: CreateTodoItemDto,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
  ) {
    return this.todoItemsService.replace(id, replaceDto, corrId, todoId);
  }

  /**
   * Updates a todo resource as Admin.
   */
  @Patch(':id/admin')
  @ApiOperation({
    summary: 'Admin Update',
    description: 'Administrative update of any todo',
  })
  @ApiOkResponse({ type: ReturnTodoItemDto })
  @ApiForbiddenResponse({ description: 'User is not an admin' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTodoItemAdminDto })
  async updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminDto: UpdateTodoItemAdminDto,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
  ): Promise<ReturnTodoItemDto> {
    return await this.todoItemsService.updateByAdmin(
      id,
      corrId,
      todoId,
      adminDto,
    );
  }
  // endregion

  @Patch(':id')
  @ApiOperation({
    summary: 'Update todo',
    description: 'Partial update of a todo resource',
  })
  @ApiOkResponse({ type: ReturnTodoItemDto })
  @ApiParam({ name: 'id', type: Number })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoItemDto,
    @CorrId() corr: number,
  ): Promise<ReturnTodoItemDto> {
    // Der Controller ruft NUR den Service auf
    return await this.todoItemsService.updateUser(id, updateTodoDto, corr);
  }

  // region delete a resource
  /**
   * Deletes a todo item. Requires ownership or admin privileges.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete todo',
    description: 'Remove a todo resource from the system',
  })
  @ApiOkResponse({
    type: ReturnTodoItemDto,
    description: 'Return the deleted resource',
  })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CorrId() corrId: number,
    @TodoId() todoId: number,
    @IsClosed() isClosed: boolean,
  ) {
    return this.todoItemsService.remove(id, corrId, todoId, isClosed);
  }
  // endregion
}
