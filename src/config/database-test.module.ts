import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../domain/entities/user.entity';
import { EmployeeProfile } from '../domain/entities/employee-profile.entity';
import { CustomerProfile } from '../domain/entities/customer-profile.entity';
import { Role } from '../domain/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [User, EmployeeProfile, CustomerProfile, Role],
      synchronize: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: false,
      dropSchema: true,
      cache: false,
      extra: {
        enableExtensions: true,
      },
      driver: require('better-sqlite3'),
    }),
  ],
})
export class DatabaseTestModule {}
