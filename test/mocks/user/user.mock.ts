export const mockCreatedUser = {
  id: '1',
  email: 'john.doe@test.com',
  passwordHash: 'hashedPassword123',
  userType: 'employee',
  roleId: 1,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  deletedAt: null,
  fullName: undefined,
  phone: undefined,
  profilePicture: undefined,
} as any;

export const mockExistingUser = {
  id: '2',
  email: 'jane.smith@test.com',
  userType: 'employee',
  roleId: 1,
  fullName: 'Jane Smith',
  phone: '0987654321',
  toPlainObject: jest.fn().mockReturnValue({
    id: '2',
    email: 'jane.smith@test.com',
    userType: 'employee',
    roleId: 1,
    fullName: 'Jane Smith',
    phone: '0987654321',
  }),
} as any;

export const mockExistingUserWithSameEmail = {
  id: '2',
  email: 'john.doe@test.com',
  userType: 'employee',
  roleId: 1,
  fullName: 'Jane Smith',
  phone: '0987654321',
  toPlainObject: jest.fn().mockReturnValue({
    id: '2',
    email: 'john.doe@test.com',
    userType: 'employee',
    roleId: 1,
    fullName: 'Jane Smith',
    phone: '0987654321',
  }),
} as any;

export const mockExistingUserWithSameUsername = {
  id: '2',
  email: 'jane.smith@test.com',
  userType: 'employee',
  roleId: 1,
  fullName: 'Jane Smith',
  phone: '0987654321',
  toPlainObject: jest.fn().mockReturnValue({
    id: '2',
    email: 'jane.smith@test.com',
    userType: 'employee',
    roleId: 1,
    fullName: 'Jane Smith',
    phone: '0987654321',
  }),
} as any;
