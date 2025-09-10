import { IResponseCode } from '../domain/interfaces/response.interface';

type Tcodes =
  | 'PKL_GENERAL_ERROR'
  | 'PKL_DATA_NOT_FOUND'
  | 'PKL_DATA_FOUND'
  | 'PKL_USER_CREATE_OK'
  | 'PKL_BAD_REQUEST'
  | 'PKL_ACCOUNT_DELETED_ERROR'
  | 'PKL_ACCOUNT_DELETED_OK'
  | 'PKL_PARKING_CREATE_OK'
  | 'PKL_USER_EMAIL_EXIST'
  | 'PKL_USER_NAME_EXIST'
  | 'PKL_USER_NOT_FOUND'
  | 'PKL_ROLE_NOT_ALLOWED'
  | 'KHL_NOTIFICATION_FAILED'
  | 'KHL_EMAIL_SENT'
  | 'PKL_JWT_EXPIRED'
  | 'PKL_JWT_INVALID'
  | 'PKL_RATE_LIMIT_LOGIN'
  | 'PKL_RATE_LIMIT_FORGOT_PASSWORD'
  | 'PKL_RATE_LIMIT_GENERAL'
  | 'PKL_BUSINESS_RULE_VIOLATION';

export const CODES: Record<Tcodes, IResponseCode> = {
  PKL_GENERAL_ERROR: {
    code: 'PKU_GENERAL_ERROR',
    message: 'General error, please try in a moment',
    status: 500,
  },
  PKL_DATA_NOT_FOUND: {
    code: 'PKU_DATA_NOT_FOUND',
    message: 'Data not found, verify the information entered',
    status: 400,
  },
  PKL_DATA_FOUND: {
    code: 'PKU_DATA_FOUND',
    message: 'Data found successfully',
    status: 200,
  },
  PKL_USER_CREATE_OK: {
    code: 'PKU_USER_CREATE_OK',
    message: 'User create successfully',
    status: 200,
  },
  PKL_PARKING_CREATE_OK: {
    code: 'PKL_PARKING_CREATE_OK',
    message: 'Parking create successfully',
    status: 200,
  },
  PKL_BAD_REQUEST: {
    code: 'PKU_BAD_REQUEST',
    message: 'The request is not in the correct format',
    status: 400,
  },
  PKL_ACCOUNT_DELETED_ERROR: {
    code: 'PKU_ACCOUNT_DELETED_ERROR',
    message: 'Error deleting user account',
    status: 400,
  },
  PKL_ACCOUNT_DELETED_OK: {
    code: 'PKU_ACCOUNT_DELETED_OK',
    message: 'Successfully deleted account',
    status: 200,
  },
  PKL_USER_EMAIL_EXIST: {
    code: 'PKL_USER_EMAIL_EXIST',
    message: 'User email, verify the information entered',
    status: 400,
  },
  PKL_USER_NAME_EXIST: {
    code: 'PKL_USER_NAME_EXIST',
    message: 'User name, verify the information entered',
    status: 400,
  },
  PKL_USER_NOT_FOUND: {
    code: 'PKL_USER_NOT_FOUND',
    message: 'Invalid email or password',
    status: 401,
  },
  PKL_ROLE_NOT_ALLOWED: {
    code: 'PKL_ROLE_NOT_ALLOWED',
    message: 'Contact your administrator to change your password.',
    status: 403,
  },
  KHL_NOTIFICATION_FAILED: {
    code: 'KHL_NOTIFICATION_FAILED',
    message: 'The notification could not be sent',
    status: 502,
  },
  KHL_EMAIL_SENT: {
    code: 'KHL_EMAIL_SENT',
    message: 'The mail was sent',
    status: 200,
  },
  PKL_JWT_EXPIRED: {
    code: 'PKL_JWT_EXPIRED',
    message: 'Token has expired. Please login again.',
    status: 401,
  },
  PKL_JWT_INVALID: {
    code: 'PKL_JWT_INVALID',
    message: 'Invalid token. Please login again.',
    status: 401,
  },
  PKL_RATE_LIMIT_LOGIN: {
    code: 'PKL_RATE_LIMIT_LOGIN',
    message: 'Too many login attempts. Please try again later.',
    status: 429,
  },
  PKL_RATE_LIMIT_FORGOT_PASSWORD: {
    code: 'PKL_RATE_LIMIT_FORGOT_PASSWORD',
    message: 'Too many password reset requests. Please try again later.',
    status: 429,
  },
  PKL_RATE_LIMIT_GENERAL: {
    code: 'PKL_RATE_LIMIT_GENERAL',
    message: 'Too many requests. Please try again later.',
    status: 429,
  },
  PKL_BUSINESS_RULE_VIOLATION: {
    code: 'PKL_BUSINESS_RULE_VIOLATION',
    message: 'Business rule violation',
    status: 400,
  },
};
