/**
 * Modelo de dominio para Usuario
 * Representa la lógica de negocio pura, sin dependencias de infraestructura
 */
export class UserModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly userName: string,
    public readonly idRole: number,
    public readonly idStatus: number,
  ) {}

  /**
   * Valida si el usuario está activo
   */
  isActive(): boolean {
    return this.idStatus === 1;
  }

  /**
   * Valida si el usuario tiene un rol específico
   */
  hasRole(roleId: number): boolean {
    return this.idRole === roleId;
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  getFullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  /**
   * Valida si el email es válido
   */
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  /**
   * Crea una instancia desde una entidad de base de datos
   */
  static fromEntity(entity: any): UserModel {
    return new UserModel(
      entity.id,
      entity.name,
      entity.lastName,
      entity.email,
      entity.phone,
      entity.userName,
      entity.idRole,
      entity.idStatus,
    );
  }

  /**
   * Convierte el modelo a un objeto plano
   */
  toPlainObject(): any {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      userName: this.userName,
      idRole: this.idRole,
      idStatus: this.idStatus,
    };
  }
}
