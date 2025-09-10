import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PreEnrolledParking } from '../../src/domain/entities/pre-enrolled-parking.entity';
import { User } from '../../src/domain/entities/user.entity';

/**
 * Helper para configurar la base de datos de pruebas
 * Utiliza SQLite en memoria para pruebas rápidas y aisladas
 */
export class DatabaseTestHelper {
  static async createTestModule(imports: any[] = []): Promise<TestingModule> {
    return Test.createTestingModule({
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
        ...imports,
      ],
    }).compile();
  }

  static async createTestModuleWithEntities(
    entities: any[],
    imports: any[] = [],
  ): Promise<TestingModule> {
    return Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [...entities, User, PreEnrolledParking],
          synchronize: true,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          logging: false,
          dropSchema: true,
        }),
        ...imports,
      ],
    }).compile();
  }

  static async cleanup(module: TestingModule): Promise<void> {
    if (module) {
      await module.close();
    }
  }

  static getTestDatabaseConfig() {
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [User, PreEnrolledParking],
      synchronize: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: false,
      dropSchema: true,
    };
  }
}
