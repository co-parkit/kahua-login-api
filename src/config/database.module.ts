import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PreEnrolledParking } from '../domain/entities/pre-enrolled-parking.entity';
import { User } from '../domain/entities/user.entity';

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
            entities: [User, PreEnrolledParking],
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
          entities: [User, PreEnrolledParking],
          synchronize: true, // ⚠️ solo en desarrollo, nunca en producción
          autoLoadEntities: true, // ahorra tener que listar todas las entities
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
