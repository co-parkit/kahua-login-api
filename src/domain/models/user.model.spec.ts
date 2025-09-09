import { UserModel } from './user.model';

describe('UserModel', () => {
  let userModel: UserModel;

  beforeEach(() => {
    userModel = new UserModel(
      1,
      'John',
      'Doe',
      'john@example.com',
      '1234567890',
      'johndoe',
      1,
      1,
    );
  });

  it('should be defined', () => {
    expect(userModel).toBeDefined();
  });

  // TODO: Implementar tests
  // - should create UserModel with correct properties
  // - should return true for isActive when idStatus is 1
  // - should return false for isActive when idStatus is not 1
  // - should return true for hasRole when role matches
  // - should return false for hasRole when role does not match
  // - should return full name correctly
  // - should validate email format correctly
  // - should create from entity correctly
  // - should convert to plain object correctly
});
