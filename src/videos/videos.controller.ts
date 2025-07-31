import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { QueryVideoDto } from './dto/query-video.dto';
import { Video } from './entities/video.entity';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new video record' })
  @ApiResponse({
    status: 201,
    description: 'Video created successfully',
    type: Video,
  })
  @ApiResponse({
    status: 409,
    description: 'Video with this ID already exists',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body(ValidationPipe) createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all video records with optional sorting' })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    enum: ['name', 'post_date', 'views_count'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'List of videos', type: [Video] })
  findAll(@Query(ValidationPipe) queryDto: QueryVideoDto): Promise<Video[]> {
    return this.videosService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a video record by ID' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'Video found', type: Video })
  @ApiResponse({ status: 404, description: 'Video not found' })
  findOne(@Param('id') id: string): Promise<Video> {
    return this.videosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a video record by ID' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'Video updated successfully',
    type: Video,
  })
  @ApiResponse({ status: 404, description: 'Video not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateVideoDto: UpdateVideoDto,
  ): Promise<Video> {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a video record by ID' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({ status: 204, description: 'Video deleted successfully' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.videosService.remove(id);
  }

  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Seed sample video data' })
  @ApiResponse({ status: 201, description: 'Sample data seeded successfully' })
  async seedSampleData(): Promise<{ message: string }> {
    await this.videosService.seedSampleData();
    return { message: 'Sample data seeded successfully' };
  }
}
