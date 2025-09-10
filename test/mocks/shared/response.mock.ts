import { IResponseCode } from '../../../src/domain/interfaces/response.interface';

export const mockResponseCode: IResponseCode = {
  code: 'USER_NOT_FOUND',
  message: 'User not found',
  status: 404,
};

export const mockResponseCodeWithoutStatus: IResponseCode = {
  code: 'VALIDATION_ERROR',
  message: 'Validation failed',
};

export const mockSuccessData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

export const mockErrorData = {
  error: 'Database connection failed',
  details: 'Connection timeout',
};
