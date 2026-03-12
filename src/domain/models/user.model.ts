/**
 * Model of domain for User
 * Represents the pure business logic, without infrastructure dependencies
 */
export class UserModel {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly userType: 'employee' | 'customer',
    public readonly roleId: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly fullName?: string,
    public readonly phone?: string,
    public readonly profilePicture?: string,
  ) {}

  isActive(): boolean {
    return this.deletedAt === null;
  }

  /**
   * Valid if the user has a specific role
   */
  hasRole(roleId: number): boolean {
    return this.roleId === roleId;
  }

  /**
   * Valid if the user is an employee
   */
  isEmployee(): boolean {
    return this.userType === 'employee';
  }

  /**
   * Valid if the user is a customer
   */
  isCustomer(): boolean {
    return this.userType === 'customer';
  }

  /**
   * Get the full name of the user
   */
  getFullName(): string {
    return this.fullName || '';
  }

  /**
   * Valid if the email is valid
   */
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  /**
   * Create an instance from a database entity
   */
  static fromEntity(entity: any): UserModel {
    const fullName =
      entity.employeeProfile?.full_name || entity.customerProfile?.full_name;
    const phone =
      entity.employeeProfile?.phone || entity.customerProfile?.phone;
    const profilePicture =
      entity.employeeProfile?.profile_picture ||
      entity.customerProfile?.profile_picture;

    return new UserModel(
      entity.id,
      entity.email,
      entity.password_hash,
      entity.user_type,
      entity.role_id,
      entity.created_at,
      entity.updated_at,
      entity.deleted_at,
      fullName,
      phone,
      profilePicture,
    );
  }

  /**
   * Convert the model to a plain object
   */
  toPlainObject(): any {
    return {
      id: this.id,
      email: this.email,
      userType: this.userType,
      roleId: this.roleId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      fullName: this.fullName,
      phone: this.phone,
      profilePicture: this.profilePicture,
    };
  }
}
