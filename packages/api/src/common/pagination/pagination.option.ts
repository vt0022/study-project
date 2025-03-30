import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortOptions } from '../enums/sortOption.enum';

export class PaginationOptions {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  size: number;

  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @IsEnum(SortOptions)
  sort?: SortOptions;
}
