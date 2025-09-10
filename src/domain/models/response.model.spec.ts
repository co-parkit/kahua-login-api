import { Response } from './response.model';
import {
  mockResponseCode,
  mockResponseCodeWithoutStatus,
  mockSuccessData,
} from '../../../test/mocks/shared/response.mock';

describe('Response', () => {
  it('should be defined', () => {
    expect(Response).toBeDefined();
  });

  describe('Constructor', () => {
    it('should create Response with string code', () => {
      const response = new Response(
        'SUCCESS',
        mockSuccessData,
        'Operation completed',
      );

      expect(response.code).toBe('SUCCESS');
      expect(response.data).toBe(mockSuccessData);
      expect(response.message).toBe('Operation completed');
      expect(response.status).toBeUndefined();
    });

    it('should create Response with IResponseCode object', () => {
      const response = new Response(mockResponseCode);

      expect(response.code).toBe('USER_NOT_FOUND');
      expect(response.message).toBe('User not found');
      expect(response.status).toBe(404);
      expect(response.data).toBeUndefined();
    });

    it('should extract properties from IResponseCode object', () => {
      const response = new Response(mockResponseCodeWithoutStatus);

      expect(response.code).toBe('VALIDATION_ERROR');
      expect(response.message).toBe('Validation failed');
      expect(response.status).toBeUndefined();
      expect(response.data).toBeUndefined();
    });

    it('should handle optional data parameter', () => {
      const response = new Response('SUCCESS');

      expect(response.code).toBe('SUCCESS');
      expect(response.data).toBeUndefined();
      expect(response.message).toBeUndefined();
      expect(response.status).toBeUndefined();
    });

    it('should handle optional message parameter', () => {
      const response = new Response('SUCCESS', mockSuccessData);

      expect(response.code).toBe('SUCCESS');
      expect(response.data).toBe(mockSuccessData);
      expect(response.message).toBeUndefined();
      expect(response.status).toBeUndefined();
    });

    it('should handle optional status parameter', () => {
      const response = new Response('SUCCESS', mockSuccessData, 'Success', 200);

      expect(response.code).toBe('SUCCESS');
      expect(response.data).toBe(mockSuccessData);
      expect(response.message).toBe('Success');
      expect(response.status).toBe(200);
    });
  });

  describe('Static Methods', () => {
    describe('success', () => {
      it('should create success response correctly with default code', () => {
        const response = Response.success(mockSuccessData);

        expect(response.code).toBe('SUCCESS');
        expect(response.data).toBe(mockSuccessData);
        expect(response.message).toBeUndefined();
        expect(response.status).toBeUndefined();
      });

      it('should create success response correctly with custom code', () => {
        const response = Response.success(mockSuccessData, 'USER_CREATED');

        expect(response.code).toBe('USER_CREATED');
        expect(response.data).toBe(mockSuccessData);
        expect(response.message).toBeUndefined();
        expect(response.status).toBeUndefined();
      });
    });

    describe('error', () => {
      it('should create error response correctly with code only', () => {
        const response = Response.error('USER_NOT_FOUND');

        expect(response.code).toBe('USER_NOT_FOUND');
        expect(response.data).toBeNull();
        expect(response.message).toBeUndefined();
        expect(response.status).toBeUndefined();
      });

      it('should create error response correctly with code and message', () => {
        const response = Response.error('USER_NOT_FOUND', 'User not found');

        expect(response.code).toBe('USER_NOT_FOUND');
        expect(response.data).toBeNull();
        expect(response.message).toBe('User not found');
        expect(response.status).toBeUndefined();
      });

      it('should create error response correctly with all parameters', () => {
        const response = Response.error(
          'USER_NOT_FOUND',
          'User not found',
          404,
        );

        expect(response.code).toBe('USER_NOT_FOUND');
        expect(response.data).toBeNull();
        expect(response.message).toBe('User not found');
        expect(response.status).toBe(404);
      });
    });
  });

  describe('toJSON', () => {
    it('should convert to JSON correctly with all properties', () => {
      const response = new Response(
        'SUCCESS',
        mockSuccessData,
        'Operation completed',
        200,
      );
      const json = response.toJSON();

      expect(json).toEqual({
        code: 'SUCCESS',
        data: mockSuccessData,
        message: 'Operation completed',
        status: 200,
      });
    });

    it('should convert to JSON correctly with minimal properties', () => {
      const response = new Response('SUCCESS');
      const json = response.toJSON();

      expect(json).toEqual({
        code: 'SUCCESS',
        data: undefined,
        message: undefined,
        status: undefined,
      });
    });

    it('should convert to JSON correctly with IResponseCode object', () => {
      const response = new Response(mockResponseCode);
      const json = response.toJSON();

      expect(json).toEqual({
        code: 'USER_NOT_FOUND',
        data: undefined,
        message: 'User not found',
        status: 404,
      });
    });

    it('should convert error response to JSON correctly', () => {
      const response = Response.error('VALIDATION_ERROR', 'Invalid input', 400);
      const json = response.toJSON();

      expect(json).toEqual({
        code: 'VALIDATION_ERROR',
        data: null,
        message: 'Invalid input',
        status: 400,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null data in constructor', () => {
      const response = new Response('SUCCESS', null, 'No data');

      expect(response.code).toBe('SUCCESS');
      expect(response.data).toBeNull();
      expect(response.message).toBe('No data');
    });

    it('should handle empty string code', () => {
      const response = new Response('', mockSuccessData);

      expect(response.code).toBe('');
      expect(response.data).toBe(mockSuccessData);
    });

    it('should handle zero status', () => {
      const response = new Response('SUCCESS', mockSuccessData, 'Success', 0);

      expect(response.status).toBe(0);
    });

    it('should handle negative status', () => {
      const response = new Response('ERROR', null, 'Error', -1);

      expect(response.status).toBe(-1);
    });
  });
});
