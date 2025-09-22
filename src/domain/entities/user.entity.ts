import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  password_hash: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['employee', 'customer'],
  })
  user_type: 'employee' | 'customer';

  @Column({ type: 'int', nullable: true })
  role_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // Relaciones
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne('EmployeeProfile', 'user', { nullable: true })
  employeeProfile: any;

  @OneToOne('CustomerProfile', 'user', { nullable: true })
  customerProfile: any;
}
