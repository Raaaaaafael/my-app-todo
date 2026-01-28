// src/modules/auth/seed/user-seed.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TodoItemEntity } from '../entities/todo-item.entity';

/**
 * A service responsible for seeding initial user data into the database during application bootstrap.
 * This service ensures the creation of predefined user accounts.
 */
@Injectable()
export class TodoSeedService implements OnApplicationBootstrap {
  /**
   * Logger instance used for logging messages related to the UserSeedService.
   *
   * Initialized with the name of the service to provide context-specific logging
   * for debugging and monitoring purposes.
   *
   * @type {Logger}
   */

  private readonly logger: Logger = new Logger(TodoSeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    const userRepo = this.dataSource.getRepository(TodoItemEntity);
    this.logger.debug(`${this.seed.name}: start`);

    // exakt dein Verhalten:
    // - admin -> id=1, isAdmin=true, password="admin"
    // - user  -> id=2, isAdmin=false, password="user"
    await this.upsertById(userRepo, 1, 'OpenAdmin', 'Example of an open admin todo',false, 1,);
    await this.upsertById(
      userRepo,
      2,
      'ClosedAdmin',
      'Example of a closed admin todo',
      true,
      1,
    );
    await this.upsertById(
      userRepo,
      3,
      'OpenUser',
      'Example of an open user todo',
      false,
      2,
    );
    await this.upsertById(
      userRepo,
      4,
      'ClosedUser',
      'Example of an closed user todo',
      true,
      2,
    );

  }

  private async upsertById(
    userRepo: Repository<TodoItemEntity>,
    id: number,
    title: string,
    description: string,
    isClosed: boolean,
    userId: number,
  ): Promise<void> {
    this.logger.verbose(
      `${this.upsertById.name}: id=${id}, title=${title}, isClosed=${isClosed}, description=${description}`,
    );
    const existing = await userRepo.findOneBy({ id });
    if (existing) return;

    await userRepo.upsert(
      {
        id,
        title,
        description,
        isClosed,
        createdById: userId,
        updatedById: userId,
      },
      ['id'],
    );
  }
}
