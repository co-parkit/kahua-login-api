import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './schema.db';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('HOST'),
        port: configService.get('PORT_DATABASE'),
        username: configService.get('USER_DATABASE'),
        password: configService.get('PASSWORD_DATABASE'),
        database: configService.get('NAME_DATABASE'),
        models: [Users],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
