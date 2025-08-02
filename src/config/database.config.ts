import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mongodb' as const,
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '27017', 10),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'example',
  database: process.env.DB_NAME ?? 'nestjs_db',
  authSource: process.env.DB_AUTH_SOURCE ?? 'admin',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));