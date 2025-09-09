import { PreEnrolledParkingModel } from '../models/pre-enrolled-parking.model';

/**
 * Interface del repositorio de pre-inscripciones de parqueaderos
 * Define el contrato para la persistencia de pre-inscripciones
 */
export interface IParkingRepository {
  /**
   * Busca una pre-inscripción por ID
   */
  findById(id: number): Promise<PreEnrolledParkingModel | null>;

  /**
   * Busca una pre-inscripción por email
   */
  findByEmail(email: string): Promise<PreEnrolledParkingModel | null>;

  /**
   * Busca una pre-inscripción por ID interno
   */
  findByInternalId(internalId: string): Promise<PreEnrolledParkingModel | null>;

  /**
   * Busca una pre-inscripción por ID externo
   */
  findByExternalId(externalId: string): Promise<PreEnrolledParkingModel | null>;

  /**
   * Crea una nueva pre-inscripción
   */
  create(
    parking: Partial<PreEnrolledParkingModel>,
  ): Promise<PreEnrolledParkingModel>;

  /**
   * Actualiza una pre-inscripción existente
   */
  update(
    id: number,
    parking: Partial<PreEnrolledParkingModel>,
  ): Promise<PreEnrolledParkingModel>;

  /**
   * Elimina una pre-inscripción
   */
  delete(id: number): Promise<boolean>;

  /**
   * Lista todas las pre-inscripciones
   */
  findAll(): Promise<PreEnrolledParkingModel[]>;
}
