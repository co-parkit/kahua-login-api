# Codecov Integration

Este proyecto está integrado con [Codecov](https://codecov.io) para monitorear la cobertura de código.

## Configuración

### 1. Token de Codecov

Para que funcione correctamente, necesitas configurar el token de Codecov en GitHub:

1. Ve a [Codecov](https://codecov.io) y conecta tu repositorio
2. Copia el token de Codecov
3. En GitHub, ve a Settings > Secrets and variables > Actions
4. Agrega un nuevo secret llamado `CODECOV_TOKEN` con el valor del token

### 2. Archivos de Configuración

- `codecov.yml`: Configuración principal de Codecov
- `.codecovignore`: Archivos a ignorar en el reporte de cobertura
- `jest.config.js`: Configuración de Jest para cobertura
- `.github/workflows/coverage.yml`: GitHub Actions workflow

## Scripts Disponibles

```bash
# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests con cobertura para CI
npm run test:cov:ci

# Verificar umbrales de cobertura
npm run coverage:check

# Generar reporte HTML
npm run test:report
```

## Umbrales de Cobertura

El proyecto tiene configurados los siguientes umbrales mínimos:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Archivos Excluidos

Los siguientes tipos de archivos están excluidos de la cobertura:

- Archivos de test (`*.spec.ts`, `*.test.ts`)
- Interfaces (`*.interface.ts`)
- DTOs (`*.dto.ts`)
- Entidades (`*.entity.ts`)
- Puntos de entrada (`main.ts`, `index.ts`)
- Archivos de configuración

## GitHub Actions

El workflow de cobertura se ejecuta en:

- Push a ramas principales (`main`, `master`, `develop`)
- Pull requests a ramas principales

### Características del Workflow

- ✅ Ejecuta tests con cobertura
- ✅ Sube resultados a Codecov
- ✅ Comenta PRs con información de cobertura
- ✅ Falla si hay errores (`fail_ci_if_error: true`)
- ✅ Soporte para múltiples versiones de Node.js

## Troubleshooting

### Cobertura 0%

Si ves cobertura 0%, verifica:

1. **Source maps**: Asegúrate de que `sourceMap: true` esté en `tsconfig.json`
2. **Paths**: Verifica que los paths en `jest.config.js` sean correctos
3. **Archivos incluidos**: Revisa `collectCoverageFrom` en la configuración de Jest

### Errores de Token

Si hay errores de autenticación:

1. Verifica que `CODECOV_TOKEN` esté configurado en GitHub Secrets
2. Asegúrate de que el token sea válido en Codecov
3. Verifica que el repositorio esté conectado en Codecov

### Fluctuaciones de Cobertura

Para evitar fallos por fluctuaciones mínimas:

- `threshold: 5%` en `codecov.yml`
- `base: auto` para comparar con la rama base automáticamente

## Enlaces Útiles

- [Documentación de Codecov](https://docs.codecov.com/)
- [Configuración de Jest](https://jestjs.io/docs/configuration)
- [GitHub Actions](https://docs.github.com/en/actions)
