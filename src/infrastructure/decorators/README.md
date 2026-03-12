# Decoradores Personalizados

## TimestampColumn

Este decorador personalizado resuelve el problema de compatibilidad entre SQLite (usado en tests) y PostgreSQL (usado en producción) para columnas de tipo timestamp.

### Problema
- SQLite no soporta el tipo de dato `timestamp` nativo de PostgreSQL
- Los tests fallan con el error: `DataTypeNotSupportedError: Data type "timestamp" in "Entity.column" is not supported by "sqlite" database`

### Solución
El decorador `TimestampColumn` detecta automáticamente el entorno:
- **Tests (SQLite)**: Usa el tipo `datetime`
- **Producción (PostgreSQL)**: Usa el tipo `timestamp`

### Uso

```typescript
import { TimestampColumn } from '../../infrastructure/decorators/timestamp-column.decorator';

@Entity()
export class MyEntity {
  @TimestampColumn()
  created_at!: Date;

  @TimestampColumn({ nullable: true })
  updated_at!: Date | null;
}
```

### Opciones
El decorador acepta todas las opciones estándar de `ColumnOptions`:

```typescript
@TimestampColumn({ 
  nullable: true,
  default: () => 'CURRENT_TIMESTAMP'
})
deleted_at!: Date | null;
```
