// src/modules/auth/types/user-request.ts
import { ReturnTodoItemDto } from 'src/todo-items/dto/return-todo-item.dto';
import { CorrelationIdRequest } from '../../../decorators/correlation-id-request';

/**
 * Represents a user-related request that extends the CorrelationIdRequest.
 * This type is used to handle requests involving user-specific data by including
 * both a correlation ID for tracing and a `user` property containing user details.
 *
 * This type combines two components:
 * 1. The CorrelationIdRequest, which allows the request to be tracked or associated
 *    with a specific correlation ID for debugging or tracing purposes.
 * 2. A user-specific payload represented by the `user` property of type `ReturnUserDto`.
 */
export type TodoRequest = CorrelationIdRequest & { user: ReturnTodoItemDto };
