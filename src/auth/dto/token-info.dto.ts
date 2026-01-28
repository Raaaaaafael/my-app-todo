import { ApiProperty } from '@nestjs/swagger';

export class TokenInfoDto {
  @ApiProperty()
  access_token: string;
}
