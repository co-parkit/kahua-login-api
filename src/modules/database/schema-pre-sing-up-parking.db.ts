import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'pre-register',
})
export class PreEnrolledParking extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column({ allowNull: false })
  legal_representative: string;

  @Column({ allowNull: false })
  nit_DV: string;

  @Column({ allowNull: false })
  phone: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  address: string;

  @Column({ allowNull: false })
  city: number;

  @Column({ allowNull: false })
  neighborhood: string;

  @Column({ allowNull: false })
  has_branches: boolean;

  @Column({ allowNull: false })
  number_of_branches: number;

  @Column({ allowNull: false })
  company_name: string;

  @Column({ allowNull: false })
  document_type: string;

  @Column({ allowNull: false })
  document_number: string;

  @Column({ allowNull: true })
  id_files: number;

  @Default(1)
  @Column({ allowNull: false })
  is_status: number;

  @Column({
    type: DataTypes.STRING(6),
    allowNull: true,
    validate: {
      isNumeric: true,
      len: [6, 6],
    },
  })
  internal_id: string;

  @Default(DataTypes.UUIDV4)
  @Column({ allowNull: true })
  external_id: string;
}
