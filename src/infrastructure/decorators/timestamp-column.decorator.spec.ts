import { TimestampColumn } from './timestamp-column.decorator';

const originalNodeEnv = process.env.NODE_ENV;

describe('TimestampColumn', () => {
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should be defined', () => {
    expect(TimestampColumn).toBeDefined();
    expect(typeof TimestampColumn).toBe('function');
  });

  it('should return a Column decorator', () => {
    const decorator = TimestampColumn();
    expect(decorator).toBeDefined();
    expect(typeof decorator).toBe('function');
  });

  it('should use datetime type when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';
    const decorator = TimestampColumn();
    expect(decorator).toBeDefined();
  });

  it('should use timestamp type when NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'development';
    const decorator = TimestampColumn();
    expect(decorator).toBeDefined();
  });

  it('should merge with custom options', () => {
    process.env.NODE_ENV = 'test';
    const decorator = TimestampColumn({ nullable: true });
    expect(decorator).toBeDefined();
  });
});
