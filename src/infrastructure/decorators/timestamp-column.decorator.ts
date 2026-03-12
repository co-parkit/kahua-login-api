import { Column, ColumnOptions } from 'typeorm';

/**
 * Custom decorator to handle timestamp columns
 * that are compatible with SQLite (tests) and PostgreSQL (production)
 */
export function TimestampColumn(options?: Partial<ColumnOptions>) {
  const isTest = process.env.NODE_ENV === 'test';

  const columnOptions: ColumnOptions = {
    type: isTest ? 'datetime' : 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    ...options,
  };

  return Column(columnOptions);
}
