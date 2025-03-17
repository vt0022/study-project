import { ApiProperty } from '@nestjs/swagger';

export class PostAddDto {
  @ApiProperty()
  content: string;
}
