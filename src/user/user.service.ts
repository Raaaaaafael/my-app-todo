import { Injectable } from '@nestjs/common';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private entityToDto(entity: UserEntity): ReturnUserDto {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      isAdmin: entity.isAdmin,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      version: entity.version,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    } as ReturnUserDto;
  }

  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
