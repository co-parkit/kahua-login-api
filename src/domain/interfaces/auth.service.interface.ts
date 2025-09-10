import { UserModel } from '../models/user.model';

/**
 * Interface del servicio de autenticación
 * Define el contrato para la lógica de autenticación
 */
export interface IAuthService {
  /**
   * Genera un token JWT para un usuario
   */
  generateJWT(user: UserModel): Promise<{ access_token: string; user: any }>;

  /**
   * Valida las credenciales de un usuario
   */
  validateUser(email: string, password: string): Promise<UserModel | null>;

  /**
   * Busca un usuario por email
   */
  findByEmail(email: string): Promise<UserModel | null>;

  /**
   * Busca un usuario por ID
   */
  findUserById(id: number): Promise<UserModel | null>;

  /**
   * Procesa la solicitud de recuperación de contraseña
   */
  forgotPassword(email: string): Promise<any>;
}
