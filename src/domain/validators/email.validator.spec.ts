import { EmailValidator } from './email.validator';

describe('EmailValidator', () => {
  describe('isValid', () => {
    it('should return true for valid email', () => {
      expect(EmailValidator.isValid('user@example.com')).toBe(true);
      expect(EmailValidator.isValid('test.user@domain.co')).toBe(true);
      expect(EmailValidator.isValid('a@b.c')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(EmailValidator.isValid('invalid')).toBe(false);
      expect(EmailValidator.isValid('missing@domain')).toBe(false);
      expect(EmailValidator.isValid('@nodomain.com')).toBe(false);
      expect(EmailValidator.isValid('nodomain@.com')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(EmailValidator.isValid(null as any)).toBe(false);
      expect(EmailValidator.isValid(undefined as any)).toBe(false);
    });

    it('should return false for non-string', () => {
      expect(EmailValidator.isValid(123 as any)).toBe(false);
      expect(EmailValidator.isValid({} as any)).toBe(false);
    });

    it('should trim whitespace before validating', () => {
      expect(EmailValidator.isValid('  user@example.com  ')).toBe(true);
    });
  });

  describe('validate', () => {
    it('should not throw for valid email', () => {
      expect(() => EmailValidator.validate('user@example.com')).not.toThrow();
    });

    it('should throw for invalid email', () => {
      expect(() => EmailValidator.validate('invalid')).toThrow(
        'Invalid email format: invalid',
      );
    });

    it('should throw with email in message', () => {
      expect(() => EmailValidator.validate('bad')).toThrow('bad');
    });
  });

  describe('normalize', () => {
    it('should trim and lowercase email', () => {
      expect(EmailValidator.normalize('  User@Example.COM  ')).toBe(
        'user@example.com',
      );
    });

    it('should handle already normalized email', () => {
      expect(EmailValidator.normalize('user@example.com')).toBe(
        'user@example.com',
      );
    });
  });

  describe('validateMultiple', () => {
    it('should separate valid and invalid emails', () => {
      const emails = [
        'valid1@test.com',
        'invalid',
        'valid2@domain.co',
        'no-at-sign',
      ];
      const result = EmailValidator.validateMultiple(emails);

      expect(result.valid).toEqual(['valid1@test.com', 'valid2@domain.co']);
      expect(result.invalid).toEqual(['invalid', 'no-at-sign']);
    });

    it('should normalize valid emails', () => {
      const result = EmailValidator.validateMultiple(['  User@Test.COM  ']);

      expect(result.valid).toEqual(['user@test.com']);
      expect(result.invalid).toEqual([]);
    });

    it('should return empty arrays for empty input', () => {
      const result = EmailValidator.validateMultiple([]);

      expect(result.valid).toEqual([]);
      expect(result.invalid).toEqual([]);
    });
  });
});
