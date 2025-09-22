/**
 * Modelo de dominio para Usuario
 * Representa la lógica de negocio pura, sin dependencias de infraestructura
 */
export class UserModel {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password_hash: string,
    public readonly user_type: 'employee' | 'customer',
    public readonly role_id: number | null,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly deleted_at: Date | null,
    public readonly full_name?: string,
    public readonly phone?: string,
    public readonly profile_picture?: string,
  ) {}

  isActive(): boolean {
    return this.deleted_at === null;
  }

  /**
   * Valid if the user has a specific role
   */
  hasRole(roleId: number): boolean {
    return this.role_id === roleId;
  }

  /**
   * Valid if the user is an employee
   */
  isEmployee(): boolean {
    return this.user_type === 'employee';
  }

  /**
   * Valid if the user is a customer
   */
  isCustomer(): boolean {
    return this.user_type === 'customer';
  }

  /**
   * Get the full name of the user
   */
  getFullName(): string {
    return this.full_name || '';
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
      user_type: this.user_type,
      role_id: this.role_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
      full_name: this.full_name,
      phone: this.phone,
      profile_picture: this.profile_picture,
    };
  }
}
