import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [DatabaseModule, VideosModule],
})
export class AppModule {}
