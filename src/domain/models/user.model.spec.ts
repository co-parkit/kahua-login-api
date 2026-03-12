import { UserModel } from './user.model';

describe('UserModel', () => {
  let userModel: UserModel;
  let inactiveUserModel: UserModel;

  beforeEach(() => {
    userModel = new UserModel(
      '1',
      'john@example.com',
      'hashedPassword123',
      'employee',
      1,
      new Date(),
      new Date(),
      null,
      'John Doe',
      '1234567890',
      'profile.jpg',
    );

    inactiveUserModel = new UserModel(
      '2',
      'jane@example.com',
      'hashedPassword456',
      'customer',
      2,
      new Date(),
      new Date(),
      new Date(), // deleted_at is not null
      'Jane Smith',
    );
  });

  it('should be defined', () => {
    expect(userModel).toBeDefined();
  });

  describe('Constructor', () => {
    it('should create UserModel with correct properties', () => {
      expect(userModel.id).toBe('1');
      expect(userModel.email).toBe('john@example.com');
      expect(userModel.passwordHash).toBe('hashedPassword123');
      expect(userModel.userType).toBe('employee');
      expect(userModel.roleId).toBe(1);
      expect(userModel.fullName).toBe('John Doe');
      expect(userModel.phone).toBe('1234567890');
      expect(userModel.profilePicture).toBe('profile.jpg');
    });
  });

  describe('isActive', () => {
    it('should return true when deletedAt is null', () => {
      expect(userModel.isActive()).toBe(true);
    });

    it('should return false when deletedAt is not null', () => {
      expect(inactiveUserModel.isActive()).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when role matches', () => {
      expect(userModel.hasRole(1)).toBe(true);
    });

    it('should return false when role does not match', () => {
      expect(userModel.hasRole(2)).toBe(false);
    });
  });

  describe('isEmployee', () => {
    it('should return true for employee user type', () => {
      expect(userModel.isEmployee()).toBe(true);
    });

    it('should return false for customer user type', () => {
      expect(inactiveUserModel.isEmployee()).toBe(false);
    });
  });

  describe('isCustomer', () => {
    it('should return true for customer user type', () => {
      expect(inactiveUserModel.isCustomer()).toBe(true);
    });

    it('should return false for employee user type', () => {
      expect(userModel.isCustomer()).toBe(false);
    });
  });

  describe('getFullName', () => {
    it('should return full name when available', () => {
      expect(userModel.getFullName()).toBe('John Doe');
    });

    it('should return empty string when full name is not available', () => {
      const userWithoutName = new UserModel(
        '3',
        'test@example.com',
        'password',
        'employee',
        1,
        new Date(),
        new Date(),
        null,
      );
      expect(userWithoutName.getFullName()).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(userModel.isValidEmail()).toBe(true);
    });

    it('should return false for invalid email', () => {
      const userWithInvalidEmail = new UserModel(
        '4',
        'invalid-email',
        'password',
        'employee',
        1,
        new Date(),
        new Date(),
        null,
      );
      expect(userWithInvalidEmail.isValidEmail()).toBe(false);
    });
  });

  describe('fromEntity', () => {
    it('should create UserModel from entity with employee profile', () => {
      const entity = {
        id: '1',
        email: 'test@example.com',
        password_hash: 'hashedPassword',
        user_type: 'employee',
        role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        employeeProfile: {
          full_name: 'Test Employee',
          phone: '1234567890',
          profile_picture: 'employee.jpg',
        },
      };

      const result = UserModel.fromEntity(entity);

      expect(result.id).toBe('1');
      expect(result.email).toBe('test@example.com');
      expect(result.fullName).toBe('Test Employee');
      expect(result.phone).toBe('1234567890');
      expect(result.profilePicture).toBe('employee.jpg');
    });

    it('should create UserModel from entity with customer profile', () => {
      const entity = {
        id: '2',
        email: 'customer@example.com',
        password_hash: 'hashedPassword',
        user_type: 'customer',
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        customerProfile: {
          full_name: 'Test Customer',
          phone: '0987654321',
          profile_picture: 'customer.jpg',
        },
      };

      const result = UserModel.fromEntity(entity);

      expect(result.id).toBe('2');
      expect(result.email).toBe('customer@example.com');
      expect(result.fullName).toBe('Test Customer');
      expect(result.phone).toBe('0987654321');
      expect(result.profilePicture).toBe('customer.jpg');
    });
  });

  describe('toPlainObject', () => {
    it('should convert model to plain object with camelCase properties', () => {
      const plainObject = userModel.toPlainObject();

      expect(plainObject).toEqual({
        id: '1',
        email: 'john@example.com',
        userType: 'employee',
        roleId: 1,
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt,
        deletedAt: null,
        fullName: 'John Doe',
        phone: '1234567890',
        profilePicture: 'profile.jpg',
      });
    });
  });
});
