/**
 * Basic tests for DataSource configuration.
 * Full integration is tested via migrations/e2e; here we only assert the export and options shape.
 */
import { AppDataSource } from './data-source';

describe('AppDataSource', () => {
  it('should be defined', () => {
    expect(AppDataSource).toBeDefined();
  });

  it('should have options with type postgres', () => {
    expect(AppDataSource.options).toBeDefined();
    expect(AppDataSource.options.type).toBe('postgres');
  });

  it('should have synchronize false', () => {
    expect(AppDataSource.options.synchronize).toBe(false);
  });

  it('should have migrations path configured', () => {
    expect(AppDataSource.options.migrations).toBeDefined();
    expect(Array.isArray(AppDataSource.options.migrations)).toBe(true);
  });

  it('should have naming strategy', () => {
    expect(AppDataSource.options.namingStrategy).toBeDefined();
  });
});
