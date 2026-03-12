import { HttpStatus } from '@nestjs/common';
import { BaseDomainException } from './base.exception';
import { CODES } from '../../config/general.codes';

describe('BaseDomainException', () => {
  describe('constructor', () => {
    it('should create exception with code, message and status', () => {
      const ex = new BaseDomainException(
        'TEST_CODE',
        'Test message',
        HttpStatus.BAD_REQUEST,
      );

      expect(ex.code).toBe('TEST_CODE');
      expect(ex.message).toBe('Test message');
      expect(ex.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(ex.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(ex.getResponse()).toMatchObject({
        code: 'TEST_CODE',
        message: 'Test message',
        timestamp: expect.any(String),
      });
    });

    it('should include details when provided', () => {
      const details = { email: 'test@test.com' };
      const ex = new BaseDomainException(
        'CODE',
        'Message',
        HttpStatus.CONFLICT,
        details,
      );

      expect(ex.details).toEqual(details);
      expect(ex.getResponse()).toMatchObject({
        code: 'CODE',
        message: 'Message',
        details,
      });
    });
  });

  describe('fromCode', () => {
    it('should create exception from predefined code', () => {
      const ex = BaseDomainException.fromCode('PKL_USER_NOT_FOUND');

      expect(ex).toBeInstanceOf(BaseDomainException);
      expect(ex.code).toBe(CODES.PKL_USER_NOT_FOUND.code);
      expect(ex.message).toBe(CODES.PKL_USER_NOT_FOUND.message);
      expect(ex.statusCode).toBe(CODES.PKL_USER_NOT_FOUND.status);
    });

    it('should accept optional details', () => {
      const details = { id: '123' };
      const ex = BaseDomainException.fromCode('PKL_DATA_NOT_FOUND', details);

      expect(ex.details).toEqual(details);
    });

    it('should use BAD_REQUEST when code status is falsy', () => {
      const codes = CODES as Record<string, { code: string; message: string; status?: number }>;
      const original = { ...codes.PKL_BAD_REQUEST };
      codes.PKL_BAD_REQUEST = { code: original.code, message: original.message };
      try {
        const ex = BaseDomainException.fromCode('PKL_BAD_REQUEST' as any);
        expect(ex.statusCode).toBe(HttpStatus.BAD_REQUEST);
      } finally {
        codes.PKL_BAD_REQUEST = original;
      }
    });
  });

  describe('custom', () => {
    it('should create custom exception', () => {
      const ex = BaseDomainException.custom(
        'CUSTOM',
        'Custom message',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

      expect(ex.code).toBe('CUSTOM');
      expect(ex.message).toBe('Custom message');
      expect(ex.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should default to BAD_REQUEST when status not provided', () => {
      const ex = BaseDomainException.custom('C', 'M');

      expect(ex.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should include details when provided', () => {
      const ex = BaseDomainException.custom(
        'C',
        'M',
        HttpStatus.BAD_REQUEST,
        { field: 'email' },
      );

      expect(ex.details).toEqual({ field: 'email' });
    });
  });
});
