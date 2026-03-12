import { User } from '../../../src/domain/entities/user.entity';

export const mockUserEntity: User = {
  id: '1',
  email: 'john.doe@test.com',
  password_hash: 'hashedPassword123',
  user_type: 'employee',
  role_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};

export const mockUserEntity2: User = {
  id: '2',
  email: 'jane.smith@test.com',
  password_hash: 'hashedPassword456',
  user_type: 'employee',
  role_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};
