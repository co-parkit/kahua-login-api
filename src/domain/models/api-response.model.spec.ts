import { ApiResponse } from './api-response.model';

describe('ApiResponse', () => {
  describe('constructor', () => {
    it('should create instance with all properties', () => {
      const data = { id: '1' };
      const res = new ApiResponse(true, 'OK', data, 'CODE', '2024-01-01T00:00:00Z');

      expect(res.success).toBe(true);
      expect(res.message).toBe('OK');
      expect(res.data).toEqual(data);
      expect(res.code).toBe('CODE');
      expect(res.timestamp).toBe('2024-01-01T00:00:00Z');
    });

    it('should use default timestamp when not provided', () => {
      const res = new ApiResponse(false, 'Error');
      expect(res.timestamp).toBeDefined();
      expect(typeof res.timestamp).toBe('string');
    });
  });

  describe('success', () => {
    it('should create success response with default message', () => {
      const data = { userId: '1' };
      const res = ApiResponse.success(data);

      expect(res.success).toBe(true);
      expect(res.message).toBe('Success');
      expect(res.data).toEqual(data);
    });

    it('should create success response with custom message', () => {
      const res = ApiResponse.success({}, 'User created');

      expect(res.success).toBe(true);
      expect(res.message).toBe('User created');
    });
  });

  describe('error', () => {
    it('should create error response with message only', () => {
      const res = ApiResponse.error('Something failed');

      expect(res.success).toBe(false);
      expect(res.message).toBe('Something failed');
      expect(res.code).toBeUndefined();
      expect(res.data).toBeUndefined();
    });

    it('should create error response with code', () => {
      const res = ApiResponse.error('Failed', 'ERR_001');

      expect(res.success).toBe(false);
      expect(res.code).toBe('ERR_001');
    });

    it('should create error response with data', () => {
      const res = ApiResponse.error('Failed', 'ERR', { field: 'email' });

      expect(res.data).toEqual({ field: 'email' });
    });
  });

  describe('fromException', () => {
    it('should create response from exception with message and code', () => {
      const ex = { message: 'Not found', code: 'NOT_FOUND', details: { id: '1' } };
      const res = ApiResponse.fromException(ex);

      expect(res.success).toBe(false);
      expect(res.message).toBe('Not found');
      expect(res.code).toBe('NOT_FOUND');
      expect(res.data).toEqual({ id: '1' });
    });

    it('should use default message when exception has no message', () => {
      const res = ApiResponse.fromException({});

      expect(res.message).toBe('An error occurred');
    });
  });

  describe('toObject', () => {
    it('should return plain object with all properties', () => {
      const res = new ApiResponse(true, 'OK', { x: 1 }, 'C', 'ts');
      const obj = res.toObject();

      expect(obj).toEqual({
        success: true,
        message: 'OK',
        data: { x: 1 },
        code: 'C',
        timestamp: 'ts',
      });
    });
  });
});
