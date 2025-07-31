import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryVideoDto {
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['name', 'post_date', 'views_count'],
    example: 'post_date',
  })
  @IsOptional()
  @IsIn(['name', 'post_date', 'views_count'])
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
