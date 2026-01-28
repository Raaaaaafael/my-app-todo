import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Fix für Property 'findOneEntityByUsername' does not exist
  async findOneEntityByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ username });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { password, ...userData } = createUserDto;

    // Explizite Typisierung löst ESLint-Fehler
    const salt = await (bcrypt.genSalt() as Promise<string>);
    const hash = await (bcrypt.hash(password, salt) as Promise<string>);

    // WICHTIG: Erstelle das Objekt korrekt für TypeORM
    const newUser = this.userRepository.create({
      ...userData,
      passwordHash: hash, // Mappe password auf passwordHash
    });

    return await this.userRepository.save(newUser);
  }
}
