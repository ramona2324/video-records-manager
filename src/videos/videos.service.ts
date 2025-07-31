import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { QueryVideoDto } from './dto/query-video.dto';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  async findAll(query: QueryVideoDto): Promise<Video[]> {
    const orderOptions = {};
    if (query.sort_by && query.order) {
      let orderByColumn: string;
      switch (query.sort_by) {
        case 'name':
          orderByColumn = 'name';
          break;
        case 'post_date':
          orderByColumn = 'post_date';
          break;
        case 'views_count':
          orderByColumn = 'views_count';
          break;
        default:
          orderByColumn = 'id'
      }
      orderOptions[orderByColumn] = query.order.toUpperCase();
    }
    return this.videosRepository.find({
      order: Object.keys(orderOptions).length > 0 ? orderOptions : undefined,
    });
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.videosRepository.findOne({ 
      where: { id }
    });
    
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    
    return video;
  }

  async create(videoData: CreateVideoDto): Promise<Video> {
    try {
      const video = this.videosRepository.create(videoData);
      return await this.videosRepository.save(video);
    } catch (error) {
      // Check if the error is a TypeORM QueryFailedError
      if (error instanceof QueryFailedError) {
        // SQL Server error codes for unique constraint violations are typically 2627 or 2601
        // The error.driverError.number holds the SQL Server error code
        if (error.driverError && (error.driverError.number === 2627 || error.driverError.number === 2601)) {
          throw new ConflictException('A video with this URL (href) already exists.');
        }
      }
      // Re-throw any other errors that are not unique constraint violtions
      throw error;
    }
  }

  async update(id: number, videoData: UpdateVideoDto): Promise<Video> {
    const video = await this.videosRepository.findOne({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    try {
      Object.assign(video, videoData);
      return await this.videosRepository.save(video);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError && (error.driverError.number === 2627 || error.driverError.number === 2601)) {
          throw new ConflictException('A video with this URL (href) already exists.');
        }
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.videosRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
  }

  async seed(): Promise<Video[]> {
    await this.videosRepository.clear(); // careful with this in production as this clear existing data for repeatable seeding

    const sampleVideos: Omit<CreateVideoDto, 'id'>[] = [
      {
        name: 'Spongebob unreleased episode',
        href: 'https://example.com/videos/spongebob-unreleased-episode',
        post_date: new Date('2024-01-15'),
        views_count: 15000,
      },
      {
        name: 'Jake And The Neverland Pirates',
        href: 'https://example.com/videos/jake-and-the-neverland-pirates',
        post_date: new Date('2023-02-20'),
        views_count: 22000,
      },
      {
        name: 'Igcognito with Vhong Navarro',
        href: 'https://example.com/videos/incognito-with-vhong-navarro',
        post_date: new Date('2023-03-15'),
        views_count: 8500,
      },
      {
        name: 'Daig Kayo ng Lola Ko',
        href: 'https://example.com/videos/daig-kayo-ng-lola-ko',
        post_date: new Date('2023-04-01'),
        views_count: 19000,
      },
      {
        name: 'Deployment Strategies for NestJS Apps',
        href: 'https://example.com/videos/deployment',
        post_date: new Date('2023-06-12'),
        views_count: 12000,
      },
      {
        name: 'Unit Testing NestJS Applications',
        href: 'https://example.com/videos/unit-testing',
        post_date: new Date('2023-07-25'),
        views_count: 17500,
      },
    ];
    
    const createdVideos: Video[] = [];
    for (const videoData of sampleVideos) {
      try {
        const video = this.videosRepository.create(videoData);
        createdVideos.push(await this.videosRepository.save(video));
      } catch (error) {
        if (error instanceof QueryFailedError) {
          if (error.driverError && (error.driverError.number === 2627 || error.driverError.number === 2601)) {
            console.warn(`Skipping seeding of duplicate video (href: ${videoData.href}).`);
            continue
          }
        }
        throw error;
      }
    }

    return createdVideos;
  }
}