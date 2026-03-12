import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { EmployeeProfile } from './employee-profile.entity';
import { CustomerProfile } from './customer-profile.entity';
import { TimestampColumn } from '../../infrastructure/decorators/timestamp-column.decorator';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'text' })
  password_hash!: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['employee', 'customer'],
  })
  user_type!: 'employee' | 'customer';

  @Column({ type: 'int', nullable: true })
  role_id!: number | null;

  @TimestampColumn()
  created_at!: Date;

  @TimestampColumn()
  updated_at!: Date;

  @TimestampColumn({ nullable: true })
  deleted_at!: Date | null;

  // Relaciones
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @OneToOne('EmployeeProfile', 'user', { nullable: true })
  employeeProfile?: EmployeeProfile;

  @OneToOne('CustomerProfile', 'user', { nullable: true })
  customerProfile?: CustomerProfile;
}
