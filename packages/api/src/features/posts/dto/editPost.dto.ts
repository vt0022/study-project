import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class EditPostDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  // @Transform(({ value }) => value === 'true' || value === true)
  // @IsBoolean()
  isPrivate: boolean;
}
