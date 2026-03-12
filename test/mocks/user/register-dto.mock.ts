import { CreateUserDto } from '../../../src/application/dtos/register.dto';

export const mockCreateUserDto: CreateUserDto = {
  email: 'john.doe@test.com',
  password: 'password123',
  user_type: 'employee',
  role_id: 1,
};
