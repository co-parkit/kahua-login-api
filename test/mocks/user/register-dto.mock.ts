import { CreateUserDto } from '../../../src/application/dtos/register.dto';

export const mockCreateUserDto: CreateUserDto = {
  name: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  phone: '1234567890',
  userName: 'johndoe',
  password: 'password123',
  idRole: 1,
};
