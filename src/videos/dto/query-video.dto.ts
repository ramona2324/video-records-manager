import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryVideoDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['name', 'date_posted', 'views_count'],
    example: 'date_posted',
  })
  @IsOptional()
  @IsIn(['name', 'date_posted', 'views_count'])
  sort_by?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
