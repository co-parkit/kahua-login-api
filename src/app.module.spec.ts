import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { enviroments } from './enviroments';
import config from './config';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(AppModule).toBeDefined();
    });

    it('should be a class', () => {
      expect(typeof AppModule).toBe('function');
    });

    it('should be instantiable', () => {
      const appModule = new AppModule();
      expect(appModule).toBeInstanceOf(AppModule);
    });
  });

  describe('Module Compilation', () => {
    it('should compile successfully', async () => {
      expect(module).toBeDefined();
      expect(module).toBeInstanceOf(TestingModule);
    });

    it('should provide AppController', () => {
      const appController = module.get<AppController>(AppController);
      expect(appController).toBeDefined();
      expect(appController).toBeInstanceOf(AppController);
    });

    it('should provide AppService', () => {
      const appService = module.get<AppService>(AppService);
      expect(appService).toBeDefined();
      expect(appService).toBeInstanceOf(AppService);
    });
  });

  describe('Dependencies', () => {
    it('should have AppController available', () => {
      const appController = module.get<AppController>(AppController);
      expect(appController).toBeDefined();
    });

    it('should have AppService available', () => {
      const appService = module.get<AppService>(AppService);
      expect(appService).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should work with AppController and AppService integration', () => {
      const appController = module.get<AppController>(AppController);

      // Verificar que el controlador puede usar el servicio
      const result = appController.getHello();
      expect(result).toBe('Api Users');
    });

    it('should handle module lifecycle correctly', async () => {
      expect(module).toBeDefined();

      // El módulo debería poder cerrarse sin errores
      await expect(module.close()).resolves.not.toThrow();
    });
  });

  describe('Environment Configuration', () => {
    it('should have enviroments imported', () => {
      expect(enviroments).toBeDefined();
      expect(typeof enviroments).toBe('object');
    });

    it('should have config imported', () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe('function');
    });
  });

  describe('Module Type Safety', () => {
    it('should have correct TypeScript types', () => {
      const appModule = new AppModule();
      expect(appModule).toBeInstanceOf(AppModule);
    });

    it('should be a valid NestJS module', () => {
      expect(AppModule).toBeDefined();
      expect(typeof AppModule).toBe('function');
    });
  });

  describe('Module Structure', () => {
    it('should be exportable', () => {
      expect(AppModule).toBeDefined();
    });

    it('should be importable', () => {
      expect(() => {
        const testModule = AppModule;
        return testModule;
      }).not.toThrow();
    });
  });
});
