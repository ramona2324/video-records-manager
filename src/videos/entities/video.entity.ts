import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Videos')
export class Video {
  @ApiProperty({ description: 'Id for the video' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: 'Name of title of the video' })
  @Column()
  name: string;

  @ApiProperty({ description: 'URL to the video' })
  @Column()
  href: string;

  @ApiProperty({ description: 'Date the video was posted mm/dd/yyyy' })
  @Column({ type: 'date' })
  date_posted: Date;

  @ApiProperty({ description: 'Number of views the video has received' })
  @Column({ type: 'int' })
  views_count: number;
}
