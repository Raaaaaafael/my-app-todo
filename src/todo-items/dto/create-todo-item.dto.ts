import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTodoItemDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
