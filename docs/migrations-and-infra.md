# Migraciones y sincronización con kahua-infra (login-api)

## Resumen de migraciones (PostgreSQL)

| #     | Archivo | Descripción |
|-------|---------|-------------|
| 170001 | CreateRoles | Tabla `roles` (id, name, description) |
| 170002 | CreateUsers | Tabla `users` (uuid, email, password_hash, user_type, role_id, timestamps) + FK a `roles` |
| 170003 | CreateCustomerProfiles | Tabla `customer_profiles` + FK a `users` |
| 170004 | CreateEmployeeProfiles | Tabla `employee_profiles` + FKs a `users` (user_id, created_by) |

## Orden y dependencias

- **170001** crea `roles`.
- **170002** crea `users` y la extensión `pgcrypto` (para `gen_random_uuid()`); FK `role_id` → `roles(id)`.
- **170003** y **170004** crean los perfiles con FK a `users(id)`.

Todas las tablas se crean en el esquema **`public`**.

## Cómo ejecutar migraciones

Desde la raíz del proyecto, con variables de entorno de BD configuradas (ver `.env.example` si existe):

```bash
# Aplicar todas las pendientes
npm run migration:run

# Ver estado
npm run migration:show

# Revertir la última
npm run migration:revert
```

El DataSource usado por la CLI está en `src/infrastructure/db/data-source.ts` y lee `HOST_DATABASE`/`HOST`, `PORT_DATABASE`/`PORT`, `USER_DATABASE`, `PASSWORD_DATABASE`, `NAME_DATABASE` (vía `dotenv`).

## Sincronización con kahua-infra

- **Base de datos**: Esta API usa el mismo PostgreSQL que define kahua-infra (DB `kahua`, usuario según infra).
- **Esquema**: Tablas en **`public`**. Si en el futuro se exige un esquema dedicado (ej. `users`), se puede añadir una migración que cree el esquema y mueva las tablas.
- **Extensiones**: La migración 170002 ejecuta `CREATE EXTENSION IF NOT EXISTS "pgcrypto"` para `gen_random_uuid()`. kahua-infra suele crear extensiones en `init-scripts/01-extensions.sql`; si ya están creadas, no hay conflicto.
- **Levantar infra primero**: Para desarrollo local, levantar antes kahua-infra (`cd kahua-infra && docker-compose up -d`) y configurar en este proyecto:
  - `HOST_DATABASE=localhost` (o `kahua-postgres` si la API corre en la misma red Docker)
  - `PORT_DATABASE` = puerto expuesto de Postgres en infra
  - `NAME_DATABASE=kahua`
  - `USER_DATABASE` / `PASSWORD_DATABASE` según el `.env` de kahua-infra.

## Desplegar migraciones en Docker

1. Levantar kahua-infra y asegurar la red `kahua-net` y el contenedor `kahua-postgres`.
2. En **kahua-login-api**, crear `.env` con las mismas credenciales que kahua-infra.
3. Ejecutar desde la raíz de kahua-login-api:

```bash
docker-compose run --rm migrate
```

O con la API (migraciones primero, luego API):

```bash
docker-compose up
```

## Convenciones (TypeORM 0.3)

- Nombres de clase de migración con timestamp de 13 dígitos (ej. `CreateRoles1700010000000`).
- Evitar bloques `DO $$ ... END $$;` en migraciones; usar sentencias SQL individuales en `queryRunner.query()`.
- FKs entre tablas propias del servicio: `ALTER TABLE ... ADD CONSTRAINT` directo.
