import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Video } from '../videos/entities/video.entity';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '1433', 10),
  username: process.env.DB_USERNAME ?? 'sa',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'master',
  entities: [Video],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  extra: {
    instanceName: process.env.DB_INSTANCE,
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    encrypt: process.env.DB_ENCRYPT === 'true',
  },
}));