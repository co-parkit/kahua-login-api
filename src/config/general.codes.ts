import { IresponseCode } from './response-code.interface';

type Tcodes =
  | 'PKL_GENERAL_ERROR'
  | 'PKL_DATA_NOT_FOUND'
  | 'PKL_DATA_FOUND'
  | 'PKL_USER_CREATE_OK'
  | 'PKL_BAD_REQUEST'
  | 'PKL_ACCOUNT_DELETED_ERROR'
  | 'PKL_ACCOUNT_DELETED_OK'
  | 'PKL_USER_EMAIL_EXIST'
  | 'PKL_USER_NAME_EXIST';

export const CODES: Record<Tcodes, IresponseCode> = {
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
    message: 'User email s, verify the information entered',
    status: 400,
  },
  PKL_USER_NAME_EXIST: {
    code: 'PKL_USER_NAME_EXIST',
    message: 'User name s, verify the information entered',
    status: 400,
  },
};
