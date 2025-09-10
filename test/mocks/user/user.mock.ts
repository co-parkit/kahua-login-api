import { UserModel } from '../../../src/domain/models/user.model';

export const mockCreatedUser = new UserModel(
  1,
  'John',
  'Doe',
  'john.doe@test.com',
  '1234567890',
  'johndoe',
  1,
  1,
);

export const mockExistingUser = new UserModel(
  2,
  'Jane',
  'Smith',
  'jane.smith@test.com',
  '0987654321',
  'janesmith',
  1,
  1,
);

export const mockExistingUserWithSameEmail = new UserModel(
  2,
  'Jane',
  'Smith',
  'john.doe@test.com',
  '0987654321',
  'janesmith',
  1,
  1,
);

export const mockExistingUserWithSameUsername = new UserModel(
  2,
  'Jane',
  'Smith',
  'jane.smith@test.com',
  '0987654321',
  'johndoe',
  1,
  1,
);
