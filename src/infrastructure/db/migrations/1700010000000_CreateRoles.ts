import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1700010000000 implements MigrationInterface {
  name = 'CreateRoles1700010000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.roles CASCADE;`);
  }
}
