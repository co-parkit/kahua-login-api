import { UserModel } from '../models/user.model';

/**
 * Interface del repositorio de usuarios
 * Define el contrato para la persistencia de usuarios
 */
export interface IUserRepository {
  /**
   * Busca un usuario por ID
   */
  findById(id: number): Promise<UserModel | null>;

  /**
   * Busca un usuario por email
   */
  findByEmail(email: string): Promise<UserModel | null>;

  /**
   * Busca un usuario por nombre de usuario
   */
  findByUserName(userName: string): Promise<UserModel | null>;

  /**
   * Busca un usuario por email o nombre de usuario
   */
  findByEmailOrUserName(
    email: string,
    userName: string,
  ): Promise<UserModel | null>;

  /**
   * Crea un nuevo usuario
   */
  create(user: Partial<UserModel>): Promise<UserModel>;

  /**
   * Actualiza un usuario existente
   */
  update(id: number, user: Partial<UserModel>): Promise<UserModel>;

  /**
   * Elimina un usuario
   */
  delete(id: number): Promise<boolean>;

  /**
   * Valida las credenciales de un usuario
   */
  validateCredentials(
    email: string,
    password: string,
  ): Promise<UserModel | null>;
}
