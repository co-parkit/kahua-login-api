import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'pre-register' })
export class PreEnrolledParking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  legalRepresentative: string;

  @Column({ nullable: false })
  nitDV: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  address: string;

  @Column({ type: 'int', nullable: false })
  city: number;

  @Column({ nullable: false })
  neighborhood: string;

  @Column({ type: 'boolean', nullable: false })
  hasBranches: boolean;

  @Column({ type: 'int', nullable: false })
  numberOfBranches: number;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: false })
  documentType: string;

  @Column({ nullable: false })
  documentNumber: string;

  @Column({ type: 'int', nullable: true })
  idFiles: number | null;

  @Column({ type: 'int', default: 1, nullable: false })
  isStatus: number;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  internalId: string;

  @Column({
    type: 'uuid',
    nullable: true,
    default: () => 'uuid_generate_v4()',
  })
  externalId: string;
}
