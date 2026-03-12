import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../domain/entities/user.entity';
import { Role } from '../domain/entities/role.entity';
import { EmployeeProfile } from '../domain/entities/employee-profile.entity';
import { CustomerProfile } from '../domain/entities/customer-profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isTest = process.env.NODE_ENV === 'test';
        if (isTest) {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [User, Role, EmployeeProfile, CustomerProfile],
            synchronize: true,
            autoLoadEntities: true,
            namingStrategy: new SnakeNamingStrategy(),
            logging: false,
            dropSchema: true,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('HOST'),
          port: configService.get<number>('PORT_DATABASE'),
          username: configService.get<string>('USER_DATABASE'),
          password: configService.get<string>('PASSWORD_DATABASE'),
          database: configService.get<string>('NAME_DATABASE'),
          entities: [User, Role, EmployeeProfile, CustomerProfile],
          synchronize: false, // ⚠️ solo en desarrollo, nunca en producción
          autoLoadEntities: true, // ahorra tener que listar todas las entities
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
