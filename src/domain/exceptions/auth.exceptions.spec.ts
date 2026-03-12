import { HttpStatus } from '@nestjs/common';
import {
  InvalidCredentialsException,
  InactiveUserException,
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
} from './auth.exceptions';

describe('Auth Exceptions', () => {
  describe('InvalidCredentialsException', () => {
    it('should have correct code and message', () => {
      const ex = new InvalidCredentialsException();

      expect(ex.code).toBe('PKL_USER_NOT_FOUND');
      expect(ex.message).toBe('Invalid email or password');
      expect(ex.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(ex.getStatus()).toBe(401);
    });
  });

  describe('InactiveUserException', () => {
    it('should have correct code and message', () => {
      const ex = new InactiveUserException();

      expect(ex.code).toBe('PKL_ROLE_NOT_ALLOWED');
      expect(ex.message).toBe(
        'Contact your administrator to change your password.',
      );
      expect(ex.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(ex.getStatus()).toBe(403);
    });
  });

  describe('EmailAlreadyExistsException', () => {
    it('should include email in message and details', () => {
      const email = 'existing@example.com';
      const ex = new EmailAlreadyExistsException(email);

      expect(ex.code).toBe('PKL_USER_EMAIL_EXIST');
      expect(ex.message).toBe(`Email ${email} is already registered`);
      expect(ex.statusCode).toBe(HttpStatus.CONFLICT);
      expect(ex.details).toEqual({ email });
    });
  });

  describe('UsernameAlreadyExistsException', () => {
    it('should include username in message and details', () => {
      const username = 'taken_user';
      const ex = new UsernameAlreadyExistsException(username);

      expect(ex.code).toBe('PKL_USER_NAME_EXIST');
      expect(ex.message).toBe(`Username ${username} is already in use`);
      expect(ex.statusCode).toBe(HttpStatus.CONFLICT);
      expect(ex.details).toEqual({ username });
    });
  });
});
