// src/modules/auth/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { TodoRequest } from 'src/todo-items/types/types/user-request';

/**
 * Custom decorator to extract the authenticated user from the current HTTP request.
 *
 * This decorator uses the `ExecutionContext` provided by NestJS to access the HTTP
 * request object and retrieves the user information that was attached to the request.
 *
 * It is typically used in scenarios where you need to access the authenticated user
 * in a controller or resolver method.
 *
 * Note:
 * - If the user is not found in the request, a warning is logged.
 * - Logs the retrieved user information for debugging purposes.
 */
export const Todo = createParamDecorator(
  // _data: optionale Daten, die man dem Decorator übergeben könnte
  // ctx: ExecutionContext enthält Informationen über den aktuellen Request
  (_data: unknown, ctx: ExecutionContext) => {
    // Zugriff auf das HTTP-Request-Objekt
    // switchToHttp() ist nötig, weil NestJS auch andere Kontexte kennt (z. B. GraphQL, RPC)
    const request: TodoRequest = ctx.switchToHttp().getRequest();
    Logger.log('', 'todo.decorator.ts');
    const todo = request.user;
    if (!todo) {
      Logger.warn('User not found in request', 'todo.decorator.ts');
    } else {
      Logger.log(
        `Todo found: ${todo.title} user: ${JSON.stringify(todo, null, 2)}`,
        'todo.decorator.ts',
      );
    }
    return todo;
  },
);
