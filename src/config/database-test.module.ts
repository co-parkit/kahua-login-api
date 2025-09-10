import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PreEnrolledParking } from '../domain/entities/pre-enrolled-parking.entity';
import { User } from '../domain/entities/user.entity';

/**
 * Módulo de base de datos para pruebas
 * Utiliza SQLite en memoria para pruebas rápidas y aisladas
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [User, PreEnrolledParking],
      synchronize: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: false,
      dropSchema: true,
    }),
  ],
})
export class DatabaseTestModule {}
