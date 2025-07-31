import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { QueryVideoDto } from './dto/query-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const existingVideo = await this.videosRepository.findOne({
      where: { id: createVideoDto.id },
    });

    if (existingVideo) {
      throw new ConflictException('Video with this ID already exists');
    }

    const video = this.videosRepository.create({
      ...createVideoDto,
      post_date: new Date(createVideoDto.post_date),
    });

    return this.videosRepository.save(video);
  }

  async findAll(queryDto: QueryVideoDto): Promise<Video[]> {
    const query = this.videosRepository.createQueryBuilder('video');

    if (queryDto.sort_by) {
      const order = queryDto.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      query.orderBy(`video.${queryDto.sort_by}`, order);
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.videosRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findOne(id);

    Object.assign(video, {
      ...updateVideoDto,
      post_date: new Date(updateVideoDto.post_date),
    });

    return this.videosRepository.save(video);
  }

  async remove(id: string): Promise<void> {
    const video = await this.findOne(id);
    await this.videosRepository.remove(video);
  }

  async seedSampleData(): Promise<void> {
    const sampleVideos = [
      {
        id: 'video_001',
        name: 'Introduction to NestJS',
        href: 'https://youtube.com/watch?v=example1',
        post_date: '2024-01-15',
        views_count: 1250,
      },
      {
        id: 'video_002',
        name: 'TypeORM Basics',
        href: 'https://youtube.com/watch?v=example2',
        post_date: '2024-01-20',
        views_count: 890,
      },
      {
        id: 'video_003',
        name: 'Building REST APIs',
        href: 'https://youtube.com/watch?v=example3',
        post_date: '2024-02-01',
        views_count: 2100,
      },
      {
        id: 'video_004',
        name: 'Database Integration',
        href: 'https://youtube.com/watch?v=example4',
        post_date: '2024-02-10',
        views_count: 1580,
      },
      {
        id: 'video_005',
        name: 'Authentication & Security',
        href: 'https://youtube.com/watch?v=example5',
        post_date: '2024-02-15',
        views_count: 3200,
      },
      {
        id: 'video_006',
        name: 'Testing Strategies',
        href: 'https://youtube.com/watch?v=example6',
        post_date: '2024-02-20',
        views_count: 950,
      },
      {
        id: 'video_007',
        name: 'Deployment Guide',
        href: 'https://youtube.com/watch?v=example7',
        post_date: '2024-02-25',
        views_count: 1750,
      },
      {
        id: 'video_008',
        name: 'Performance Optimization',
        href: 'https://youtube.com/watch?v=example8',
        post_date: '2024-03-01',
        views_count: 2800,
      },
    ];

    for (const videoData of sampleVideos) {
      const existingVideo = await this.videosRepository.findOne({
        where: { id: videoData.id },
      });

      if (!existingVideo) {
        const video = this.videosRepository.create({
          ...videoData,
          post_date: new Date(videoData.post_date),
        });
        await this.videosRepository.save(video);
      }
    }
  }
}
