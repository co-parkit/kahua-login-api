import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  phone: string | null;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ type: 'int', nullable: false })
  idRole: number;

  @Column({ type: 'int', default: 1, nullable: false })
  idStatus: number;
}
