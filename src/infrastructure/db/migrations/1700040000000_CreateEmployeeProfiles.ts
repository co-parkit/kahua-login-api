import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeProfiles1700040000000 implements MigrationInterface {
  name = 'CreateEmployeeProfiles1700040000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.employee_profiles (
        user_id UUID PRIMARY KEY,
        full_name VARCHAR(150),
        profile_picture TEXT,
        department VARCHAR(100),
        position VARCHAR(100),
        phone VARCHAR(30),
        age INTEGER,
        city_id INTEGER,
        created_by UUID,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      ALTER TABLE public.employee_profiles
        ADD CONSTRAINT fk_employee_profiles_user
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE public.employee_profiles
        ADD CONSTRAINT fk_employee_profiles_created_by
        FOREIGN KEY (created_by) REFERENCES public.users(id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_profiles_city_id ON public.employee_profiles (city_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_profiles_created_by ON public.employee_profiles (created_by);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE public.employee_profiles DROP CONSTRAINT IF EXISTS fk_employee_profiles_created_by;`);
    await queryRunner.query(`ALTER TABLE public.employee_profiles DROP CONSTRAINT IF EXISTS fk_employee_profiles_user;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.employee_profiles CASCADE;`);
  }
}
