import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVideoDto {
  // @ApiProperty({
  //   description: 'Unique identifier for the video',
  //   example: 'video_001',
  // })
  // @IsString()
  // @IsNotEmpty()
  // id: string;

  @ApiProperty({
    description: 'Name or title of the video',
    example: 'Introduction to NestJS',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'URL link to the video',
    example: 'https://youtube.com/watch?v=example',
  })
  @IsString()
  @IsNotEmpty()
  href: string;

  @ApiProperty({
    description: 'Date the video was posted',
    example: '2024-01-15',
  })
  @IsDate()
  @Type(() => Date)
  post_date: Date;

  @ApiProperty({ description: 'Number of views', example: 1250 })
  @IsInt()
  @Min(0)
  views_count: number;
}
