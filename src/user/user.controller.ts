import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ReturnUserDto } from './dto/return-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-Admin.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('user') // Gruppiert die Endpunkte in Swagger
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<ReturnUserDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id') // Geändert von :id/admin auf :id laut 1.2.3
  @ApiOperation({ summary: 'Get user by id' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReturnUserDto> {
    return await this.userService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ReturnUserDto> {
    return await this.userService.remove(id);
  }

  @Patch(':id/admin') // Korrekte Route laut 1.2.5
  @ApiOperation({ summary: 'Update user admin status' })
  async updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAdminDto: UpdateUserAdminDto,
  ): Promise<ReturnUserDto> {
    return await this.userService.updateAdminStatus(id, updateUserAdminDto);
  }
}
