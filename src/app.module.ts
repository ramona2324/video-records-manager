import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { VideosModule } from './videos/videos.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        if (!dbConfig) {
          throw new Error('Database configuration "database" not found in ConfigService. Check database.config.ts and ConfigModule setup.');
        }

        console.log('Successfully loaded database configuration:', dbConfig);
        return dbConfig;
      },
    }),

    // Feature modules
    VideosModule,
  ],
})
export class AppModule {}