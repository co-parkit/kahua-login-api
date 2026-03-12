import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { TimestampColumn } from '../../infrastructure/decorators/timestamp-column.decorator';

@Entity({ name: 'customer_profiles' })
export class CustomerProfile {
  @PrimaryColumn({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  full_name!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ type: 'text', nullable: true })
  profile_picture!: string | null;

  @Column({ type: 'int', nullable: true })
  city_id!: number | null;

  @Column({ type: 'boolean', nullable: true })
  accepted_terms!: boolean | null;

  @Column({ type: 'int', nullable: true })
  age!: number | null;

  @TimestampColumn()
  created_at!: Date;

  @OneToOne('User', 'customerProfile')
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
