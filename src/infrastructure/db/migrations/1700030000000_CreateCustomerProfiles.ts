import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerProfiles1700030000000 implements MigrationInterface {
  name = 'CreateCustomerProfiles1700030000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.customer_profiles (
        user_id UUID PRIMARY KEY,
        full_name VARCHAR(150),
        phone VARCHAR(30),
        profile_picture TEXT,
        city_id INTEGER,
        accepted_terms BOOLEAN,
        age INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      ALTER TABLE public.customer_profiles
        ADD CONSTRAINT fk_customer_profiles_user
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_profiles_city_id ON public.customer_profiles (city_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE public.customer_profiles DROP CONSTRAINT IF EXISTS fk_customer_profiles_user;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.customer_profiles CASCADE;`);
  }
}
