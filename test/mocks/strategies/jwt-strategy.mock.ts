export const mockJwtPayload = {
  sub: 1,
  email: 'test@example.com',
  name: 'John',
  lastName: 'Doe',
  role: 1,
  status: 1,
};

export const mockJwtPayloadWithDifferentRole = {
  sub: 2,
  email: 'admin@example.com',
  name: 'Admin',
  lastName: 'User',
  role: 2,
  status: 1,
};

export const mockJwtPayloadInactive = {
  sub: 3,
  email: 'inactive@example.com',
  name: 'Inactive',
  lastName: 'User',
  role: 1,
  status: 0,
};

export const mockConfigService = {
  jwtSecret: 'test-secret-key',
};

export const mockConfigServiceWithDifferentSecret = {
  jwtSecret: 'different-secret-key',
};
