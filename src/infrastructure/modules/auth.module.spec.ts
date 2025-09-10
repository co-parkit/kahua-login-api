import { AuthModule } from './auth.module';

describe('AuthModule', () => {
  describe('Module Structure', () => {
    it('should be defined', () => {
      expect(AuthModule).toBeDefined();
    });

    it('should be a class', () => {
      expect(typeof AuthModule).toBe('function');
    });

    it('should have module decorator', () => {
      const moduleMetadata = Reflect.getMetadata('imports', AuthModule);
      expect(moduleMetadata).toBeDefined();
    });
  });

  describe('Module Configuration', () => {
    it('should have imports property', () => {
      const metadata = Reflect.getMetadata('imports', AuthModule);
      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
    });

    it('should have controllers property', () => {
      const metadata = Reflect.getMetadata('controllers', AuthModule);
      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
    });

    it('should have providers property', () => {
      const metadata = Reflect.getMetadata('providers', AuthModule);
      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
    });

    it('should have exports property', () => {
      const metadata = Reflect.getMetadata('exports', AuthModule);
      expect(metadata).toBeDefined();
      expect(Array.isArray(metadata)).toBe(true);
    });
  });
});
