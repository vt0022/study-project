import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class EditPostDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  isPrivate: boolean;
}
