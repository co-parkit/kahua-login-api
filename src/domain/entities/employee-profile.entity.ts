import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'employee_profiles' })
export class EmployeeProfile {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  full_name: string;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'int', nullable: true })
  city_id: number;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Relaciones
  @OneToOne('User', 'employeeProfile')
  @JoinColumn({ name: 'user_id' })
  user: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: any;
}
