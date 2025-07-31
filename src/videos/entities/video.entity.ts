import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Unique } from 'typeorm';

@Entity('Videos')
@Unique(['href'])
export class Video {
  @PrimaryGeneratedColumn('increment') // Explicitly specify increment strategy
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  href: string;

  @CreateDateColumn({ type: 'datetime2' })
  post_date: Date;

  @Column({ default: 0 })
  views_count: number
}