import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1700020000000 implements MigrationInterface {
  name = 'CreateUsers1700020000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('employee', 'customer')),
        role_id INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        deleted_at TIMESTAMPTZ
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email ON public.users (lower(email));
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users (role_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users (deleted_at);
    `);
    await queryRunner.query(`
      ALTER TABLE public.users
        ADD CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES public.roles(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE public.users DROP CONSTRAINT IF EXISTS fk_users_role;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.users CASCADE;`);
  }
}
