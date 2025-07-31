import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpStatus } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Video } from './entities/video.entity';
import { QueryVideoDto } from './dto/query-video.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all video records' })
  @ApiResponse({ status: 200, description: 'List of videos', type: [Video] })
  @ApiQuery({ name: 'sort_by', required: false, enum: ['name', 'post_date', 'views_count'], description: 'Field to sort by' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Sort order (asc or desc)' })
  findAll(@Query() query: QueryVideoDto): Promise<Video[]> {
    return this.videosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single video record by ID' })
  @ApiParam({ name: 'id', description: 'Unique ID of the video', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'The found video record', type: Video })
  @ApiResponse({ status: 404, description: 'Video not found' })
  findOne(@Param('id') id: number): Promise<Video> {
    return this.videosService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new video record' })
  @ApiBody({ type: CreateVideoDto, description: 'Video record data' })
  @ApiResponse({ status: 201, description: 'The created video record', type: Video })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videosService.create(createVideoDto); // Use DTO
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing video record' })
  @ApiParam({ name: 'id', description: 'Unique ID of the video', type: Number, example: 2 })
  @ApiBody({ type: UpdateVideoDto, description: 'Updated video record data' })
  @ApiResponse({ status: 200, description: 'The updated video record', type: Video })
  @ApiResponse({ status: 404, description: 'Video not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  update(@Param('id') id: number, @Body() updateVideoDto: UpdateVideoDto): Promise<Video> {
    return this.videosService.update(+id, updateVideoDto); // Use DTO
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a video record by ID' })
  @ApiParam({ name: 'id', description: 'Unique ID of the video', type: Number, example: 3 })
  @ApiResponse({ status: 204, description: 'Video record successfully deleted' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  remove(@Param('id') id: number): Promise<void> {
    return this.videosService.remove(+id);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed the database with sample video records' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully', type: [Video] })
  @ApiResponse({ status: 500, description: 'Internal server error during seeding' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict: IDs in seed data already exist' })
  async seedDatabase(): Promise<Video[]> {
    try {
      const seededVideos = await this.videosService.seed();
      return seededVideos;
    } catch (error) {
      throw error;
    }
  }
}