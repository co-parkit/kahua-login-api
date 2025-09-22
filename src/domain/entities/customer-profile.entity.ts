import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'customer_profiles' })
export class CustomerProfile {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  profile_picture: string;

  @Column({ type: 'int', nullable: true })
  city_id: number;

  @Column({ type: 'boolean', nullable: true })
  accepted_terms: boolean;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Relaciones
  @OneToOne('User', 'customerProfile')
  @JoinColumn({ name: 'user_id' })
  user: any;
}
