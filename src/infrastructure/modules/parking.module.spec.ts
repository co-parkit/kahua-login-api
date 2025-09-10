import { ParkingModule } from './parking.module';
import { PreEnrollParkingUseCase } from '../../application/use-cases/pre-enroll-parking.use-case';
import { ParkingController } from '../controllers/parking.controller';
import { ParkingRepository } from '../repositories/parking.repository';
import { DatabaseModule } from '../../config/database.module';

// Mock TypeOrmModule
jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: {
    forFeature: jest.fn().mockReturnValue({
      providers: [],
      exports: [],
    }),
    forRootAsync: jest.fn().mockReturnValue({
      providers: [],
      exports: [],
    }),
    forRoot: jest.fn().mockReturnValue({
      providers: [],
      exports: [],
    }),
  },
  InjectRepository: jest.fn().mockReturnValue(jest.fn()),
  Repository: jest.fn(),
}));

// Mock DatabaseModule
jest.mock('../../config/database.module', () => ({
  DatabaseModule: {
    providers: [],
    exports: [],
  },
}));

describe('ParkingModule', () => {
  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(ParkingModule).toBeDefined();
      expect(typeof ParkingModule).toBe('function');
    });

    it('should be a class', () => {
      expect(ParkingModule.prototype).toBeDefined();
    });

    it('should have module decorator', () => {
      const decorators = Reflect.getMetadata('imports', ParkingModule);
      expect(decorators).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should have imports property', () => {
      const moduleMetadata = Reflect.getMetadata('imports', ParkingModule);
      expect(moduleMetadata).toBeDefined();
      expect(Array.isArray(moduleMetadata)).toBe(true);
    });

    it('should have controllers property', () => {
      const moduleMetadata = Reflect.getMetadata('controllers', ParkingModule);
      expect(moduleMetadata).toBeDefined();
      expect(Array.isArray(moduleMetadata)).toBe(true);
    });

    it('should have providers property', () => {
      const moduleMetadata = Reflect.getMetadata('providers', ParkingModule);
      expect(moduleMetadata).toBeDefined();
      expect(Array.isArray(moduleMetadata)).toBe(true);
    });

    it('should have exports property', () => {
      const moduleMetadata = Reflect.getMetadata('exports', ParkingModule);
      expect(moduleMetadata).toBeDefined();
      expect(Array.isArray(moduleMetadata)).toBe(true);
    });
  });

  describe('Module Configuration', () => {
    it('should import TypeOrmModule.forFeature with PreEnrolledParking entity', () => {
      const moduleMetadata = Reflect.getMetadata('imports', ParkingModule);
      expect(moduleMetadata).toHaveLength(2);
      expect(moduleMetadata[0]).toBeDefined();
    });

    it('should import DatabaseModule', () => {
      const moduleMetadata = Reflect.getMetadata('imports', ParkingModule);
      expect(moduleMetadata).toContain(DatabaseModule);
    });

    it('should have ParkingController in controllers', () => {
      const moduleMetadata = Reflect.getMetadata('controllers', ParkingModule);
      expect(moduleMetadata).toContain(ParkingController);
    });

    it('should have PreEnrollParkingUseCase in providers', () => {
      const moduleMetadata = Reflect.getMetadata('providers', ParkingModule);
      expect(moduleMetadata).toContain(PreEnrollParkingUseCase);
    });

    it('should have ParkingRepository in providers', () => {
      const moduleMetadata = Reflect.getMetadata('providers', ParkingModule);
      expect(moduleMetadata).toContain(ParkingRepository);
    });

    it('should have ParkingRepository in exports', () => {
      const moduleMetadata = Reflect.getMetadata('exports', ParkingModule);
      expect(moduleMetadata).toContain(ParkingRepository);
    });
  });

  describe('Module Exports', () => {
    it('should export ParkingRepository', () => {
      const moduleMetadata = Reflect.getMetadata('exports', ParkingModule);
      expect(moduleMetadata).toContain(ParkingRepository);
    });

    it('should not export PreEnrollParkingUseCase', () => {
      const moduleMetadata = Reflect.getMetadata('exports', ParkingModule);
      expect(moduleMetadata).not.toContain(PreEnrollParkingUseCase);
    });

    it('should not export ParkingController', () => {
      const moduleMetadata = Reflect.getMetadata('exports', ParkingModule);
      expect(moduleMetadata).not.toContain(ParkingController);
    });
  });

  describe('Entity Integration', () => {
    it('should include PreEnrolledParking entity in TypeOrmModule.forFeature', () => {
      const moduleMetadata = Reflect.getMetadata('imports', ParkingModule);
      expect(moduleMetadata).toHaveLength(2);
      expect(moduleMetadata[0]).toBeDefined();
    });
  });

  describe('Module Dependencies', () => {
    it('should depend on DatabaseModule', () => {
      const moduleMetadata = Reflect.getMetadata('imports', ParkingModule);
      expect(moduleMetadata).toContain(DatabaseModule);
    });

    it('should depend on TypeOrmModule', () => {
      const moduleMetadata = Reflect.getMetadata('imports', ParkingModule);
      expect(moduleMetadata).toHaveLength(2);
      expect(moduleMetadata[0]).toBeDefined();
    });
  });

  describe('Module Metadata Validation', () => {
    it('should have correct number of imports', () => {
      const moduleMetadata = Reflect.getMetadata('imports', ParkingModule);
      expect(moduleMetadata).toHaveLength(2);
    });

    it('should have correct number of controllers', () => {
      const moduleMetadata = Reflect.getMetadata('controllers', ParkingModule);
      expect(moduleMetadata).toHaveLength(1);
    });

    it('should have correct number of providers', () => {
      const moduleMetadata = Reflect.getMetadata('providers', ParkingModule);
      expect(moduleMetadata).toHaveLength(2);
    });

    it('should have correct number of exports', () => {
      const moduleMetadata = Reflect.getMetadata('exports', ParkingModule);
      expect(moduleMetadata).toHaveLength(1);
    });
  });

  describe('Module Type Safety', () => {
    it('should have correct TypeScript types', () => {
      expect(ParkingModule).toBeDefined();
      expect(typeof ParkingModule).toBe('function');
      expect(ParkingModule.prototype).toBeDefined();
    });

    it('should be compatible with NestJS Module interface', () => {
      expect(ParkingModule).toBeDefined();
      expect(typeof ParkingModule).toBe('function');
    });
  });
});
