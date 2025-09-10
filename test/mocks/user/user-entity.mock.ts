import { User } from '../../../src/domain/entities/user.entity';

export const mockUserEntity: User = {
  id: 1,
  name: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  phone: '1234567890',
  userName: 'johndoe',
  password: 'hashedPassword123',
  idRole: 1,
  idStatus: 1,
};

export const mockUserEntity2: User = {
  id: 2,
  name: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@test.com',
  phone: '0987654321',
  userName: 'janesmith',
  password: 'hashedPassword456',
  idRole: 1,
  idStatus: 1,
};
