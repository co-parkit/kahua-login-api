/**
 * Modelo de dominio para Pre-inscripción de Parqueadero
 * Representa la lógica de negocio pura, sin dependencias de infraestructura
 */
export class PreEnrolledParkingModel {
  constructor(
    public readonly id: number,
    public readonly legalRepresentative: string,
    public readonly nitDV: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly address: string,
    public readonly city: number,
    public readonly neighborhood: string,
    public readonly hasBranches: boolean,
    public readonly numberOfBranches: number,
    public readonly companyName: string,
    public readonly documentType: string,
    public readonly documentNumber: string,
    public readonly idFiles: number | null,
    public readonly isStatus: number,
    public readonly internalId: string | null,
    public readonly externalId: string | null,
  ) {}

  isActive(): boolean {
    return this.isStatus === 1;
  }

  hasMultipleBranches(): boolean {
    return this.hasBranches && this.numberOfBranches > 1;
  }

  getFullAddress(): string {
    return `${this.address}, ${this.neighborhood}`;
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  isValidPhone(): boolean {
    const phoneRegex = /^\d{1,10}$/;
    return phoneRegex.test(this.phone);
  }

  static fromEntity(entity: any): PreEnrolledParkingModel {
    return new PreEnrolledParkingModel(
      entity.id,
      entity.legalRepresentative,
      entity.nitDV,
      entity.phone,
      entity.email,
      entity.address,
      entity.city,
      entity.neighborhood,
      entity.hasBranches,
      entity.numberOfBranches,
      entity.companyName,
      entity.documentType,
      entity.documentNumber,
      entity.idFiles,
      entity.isStatus,
      entity.internalId,
      entity.externalId,
    );
  }

  toPlainObject(): any {
    return {
      id: this.id,
      legalRepresentative: this.legalRepresentative,
      nitDV: this.nitDV,
      phone: this.phone,
      email: this.email,
      address: this.address,
      city: this.city,
      neighborhood: this.neighborhood,
      hasBranches: this.hasBranches,
      numberOfBranches: this.numberOfBranches,
      companyName: this.companyName,
      documentType: this.documentType,
      documentNumber: this.documentNumber,
      idFiles: this.idFiles,
      isStatus: this.isStatus,
      internalId: this.internalId,
      externalId: this.externalId,
    };
  }
}
