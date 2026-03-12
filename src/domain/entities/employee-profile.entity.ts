import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { TimestampColumn } from '../../infrastructure/decorators/timestamp-column.decorator';

@Entity({ name: 'employee_profiles' })
export class EmployeeProfile {
  @PrimaryColumn({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  full_name!: string | null;

  @Column({ type: 'text', nullable: true })
  profile_picture!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  position!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ type: 'int', nullable: true })
  age!: number | null;

  @Column({ type: 'int', nullable: true })
  city_id!: number | null;

  @Column({ type: 'uuid', nullable: true })
  created_by!: string | null;

  @TimestampColumn()
  created_at!: Date;

  // Relaciones
  @OneToOne('User', 'employeeProfile')
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator?: User;
}
