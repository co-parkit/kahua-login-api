import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './schema-user.db';
import { PreEnrolledParking } from './schema-pre-sing-up-parking.db';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('HOST'),
        port: +configService.get<number>('PORT_DATABASE'),
        username: configService.get<string>('USER_DATABASE'),
        password: configService.get<string>('PASSWORD_DATABASE'),
        database: configService.get<string>('NAME_DATABASE'),
        entities: [User, PreEnrolledParking],
        synchronize: true, // ⚠️ solo en desarrollo, nunca en producción
        autoLoadEntities: true, // ahorra tener que listar todas las entities
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class DatabaseModule {}
