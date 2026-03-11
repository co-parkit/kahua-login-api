import 'dotenv/config';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const nodeEnv = process.env.NODE_ENV || 'development';
const isTs = __filename.endsWith('.ts');
const migrationExt = isTs ? 'ts' : 'js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST_DATABASE ?? process.env.HOST ?? 'localhost',
  port: Number(process.env.PORT_DATABASE ?? process.env.PORT ?? '5432'),
  username: process.env.USER_DATABASE,
  password: process.env.PASSWORD_DATABASE,
  database: process.env.NAME_DATABASE,
  migrations: [join(__dirname, 'migrations', `*.${migrationExt}`)],
  migrationsTableName: 'typeorm_migrations',
  namingStrategy: new SnakeNamingStrategy(),
  entities: [],
  synchronize: false,
  logging: nodeEnv === 'development' ? ['migration', 'error'] : ['error'],
});
