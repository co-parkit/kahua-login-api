# 🚀 Kahua Login API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://github.com/kahua-login-api/kahua-login-api/actions" target="_blank"><img src="https://github.com/kahua-login-api/kahua-login-api/workflows/CI/badge.svg" alt="CI Status" /></a>
  <a href="https://codecov.io/gh/kahua-login-api/kahua-login-api" target="_blank"><img src="https://codecov.io/gh/kahua-login-api/kahua-login-api/branch/main/graph/badge.svg" alt="Coverage" /></a>
</p>

<p align="center">
  API de autenticación y gestión de usuarios construida con <a href="http://nestjs.com/" target="_blank">NestJS</a>, 
  <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> y 
  <a href="https://typeorm.io/" target="_blank">TypeORM</a>.
</p>

## 📋 Tabla de Contenidos

- [🚀 Características](#-características)
- [🛠️ Tecnologías](#️-tecnologías)
- [📦 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [🏃‍♂️ Ejecución](#️-ejecución)
- [🧪 Pruebas](#-pruebas)
- [📊 Cobertura de Código](#-cobertura-de-código)
- [🔄 CI/CD](#-cicd)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Scripts Disponibles](#-scripts-disponibles)
- [📚 Documentación de la API](#-documentación-de-la-api)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🚀 Características

- ✅ **Autenticación JWT** con Passport.js
- ✅ **Gestión de usuarios** con validación completa
- ✅ **Pre-inscripción de estacionamientos** con reglas de negocio
- ✅ **Rate limiting** para endpoints críticos
- ✅ **Validación de datos** con class-validator
- ✅ **Documentación automática** con Swagger
- ✅ **Pruebas unitarias** con Jest y SQLite en memoria
- ✅ **Cobertura de código** del 97%+
- ✅ **CI/CD** con GitHub Actions
- ✅ **Arquitectura hexagonal** (Clean Architecture)

## 🛠️ Tecnologías

### **Backend**
- [NestJS](https://nestjs.com/) - Framework de Node.js
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje de programación
- [TypeORM](https://typeorm.io/) - ORM para TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Base de datos principal
- [SQLite](https://www.sqlite.org/) - Base de datos para pruebas

### **Autenticación y Seguridad**
- [Passport.js](https://www.passportjs.org/) - Middleware de autenticación
- [JWT](https://jwt.io/) - JSON Web Tokens
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Hash de contraseñas
- [@nestjs/throttler](https://docs.nestjs.com/security/rate-limiting) - Rate limiting

### **Validación y Documentación**
- [class-validator](https://github.com/typestack/class-validator) - Validación de DTOs
- [class-transformer](https://github.com/typestack/class-transformer) - Transformación de objetos
- [Swagger](https://swagger.io/) - Documentación de API

### **Testing y Calidad**
- [Jest](https://jestjs.io/) - Framework de pruebas
- [Supertest](https://www.npmjs.com/package/supertest) - Pruebas HTTP
- [ESLint](https://eslint.org/) - Linter de código
- [Prettier](https://prettier.io/) - Formateador de código

## 📦 Instalación

### **Prerrequisitos**
- Node.js (v18.x o superior)
- npm o yarn
- PostgreSQL (para desarrollo y producción)

### **Clonar el repositorio**
```bash
git clone https://github.com/kahua-login-api/kahua-login-api.git
cd kahua-login-api
```

### **Instalar dependencias**
```bash
npm install
```

## ⚙️ Configuración

### **Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de datos
HOST=localhost
PORT_DATABASE=5432
USER_DATABASE=your_username
PASSWORD_DATABASE=your_password
NAME_DATABASE=kahua_login_db

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Logging
LOG_LEVEL=info

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Email (opcional)
EMAIL_ENABLED=false
EMAIL_MOCK=true
```

### **Configuración de Base de Datos**

#### **Desarrollo/Producción (PostgreSQL)**
```bash
# Crear base de datos
createdb kahua_login_db

# Las tablas se crean automáticamente con synchronize: true
```

#### **Pruebas (SQLite en Memoria)**
```bash
# No requiere configuración adicional
# Se usa automáticamente cuando NODE_ENV=test
```

## 🏃‍♂️ Ejecución

### **Desarrollo**
```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo debug
npm run start:debug
```

### **Producción**
```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

### **Verificar la aplicación**
```bash
# Health check
curl http://localhost:3000

# Documentación Swagger
http://localhost:3000/api
```

## 🧪 Pruebas

### **Configuración de Pruebas**

El proyecto utiliza **SQLite en memoria** para las pruebas, lo que proporciona:
- ⚡ **Velocidad**: Ejecución rápida sin dependencias externas
- 🔒 **Aislamiento**: Cada prueba tiene su propia base de datos
- 🧹 **Limpieza**: La base de datos se limpia automáticamente
- 🚀 **CI/CD**: Funciona en cualquier entorno sin configuración

### **Ejecutar Pruebas**

```bash
# Todas las pruebas
npm test

# Pruebas con cobertura
npm run test:cov

# Pruebas en modo watch
npm run test:watch

# Pruebas para CI/CD
npm run test:cov:ci

# Pruebas E2E
npm run test:e2e
```

### **Estructura de Pruebas**

```
test/
├── helpers/
│   ├── database.helper.ts    # Helper para configuración de DB
│   └── test-helpers.ts       # Utilidades de prueba
├── mocks/                    # Mocks centralizados
│   ├── auth/
│   ├── controllers/
│   ├── decorators/
│   ├── interceptors/
│   ├── modules/
│   ├── parking/
│   ├── repositories/
│   ├── shared/
│   └── strategies/
├── setup.ts                  # Configuración global de Jest
└── test.env                  # Variables de entorno para pruebas
```

## 📊 Cobertura de Código

### **Métricas Actuales**
- **Statements**: 97.81% (447/457) ✅
- **Branches**: 98.07% (51/52) ✅
- **Functions**: 92.55% (87/94) ✅
- **Lines**: 97.55% (399/409) ✅

### **Umbrales Configurados**
- **Branches**: 80% ✅
- **Functions**: 80% ✅
- **Lines**: 80% ✅
- **Statements**: 80% ✅

### **Verificar Cobertura**
```bash
# Generar reporte de cobertura
npm run test:cov

# Verificar umbrales
npm run coverage:check

# Abrir reporte en navegador
npm run test:report
```

## 🔄 CI/CD

### **GitHub Actions**

El proyecto incluye un pipeline completo de CI/CD:

```yaml
# .github/workflows/ci.yml
- ✅ Checkout del código
- ✅ Setup de Node.js (18.x, 20.x)
- ✅ Instalación de dependencias
- ✅ Linting con ESLint
- ✅ Pruebas con SQLite en memoria
- ✅ Generación de cobertura
- ✅ Subida a Codecov
- ✅ Build de la aplicación
```

### **Configuración de Codecov**

```yaml
# codecov.yml
coverage:
  status:
    project:
      default:
        target: 80%
        threshold: 5%
    patch:
      default:
        target: 80%
        threshold: 5%
```

### **Estados de CI/CD**

| Estado | Descripción |
|--------|-------------|
| ✅ **Tests** | 370 pruebas pasando |
| ✅ **Coverage** | 97%+ cobertura |
| ✅ **Linting** | Código sin errores |
| ✅ **Build** | Compilación exitosa |

## 📁 Estructura del Proyecto

```
src/
├── application/              # Capa de aplicación (Clean Architecture)
│   ├── dtos/                # Data Transfer Objects
│   ├── services/            # Servicios de aplicación
│   └── use-cases/           # Casos de uso
├── config/                  # Configuración
│   ├── constants.ts         # Constantes
│   ├── database.module.ts   # Módulo de base de datos
│   ├── general.codes.ts     # Códigos de respuesta
│   └── logger.ts            # Logger personalizado
├── domain/                  # Capa de dominio (Clean Architecture)
│   ├── entities/            # Entidades de TypeORM
│   ├── exceptions/          # Excepciones personalizadas
│   ├── interfaces/          # Interfaces del dominio
│   └── models/              # Modelos de dominio
├── infrastructure/          # Capa de infraestructura (Clean Architecture)
│   ├── controllers/         # Controladores REST
│   ├── decorators/          # Decoradores personalizados
│   ├── guards/              # Guards de autenticación
│   ├── interceptors/        # Interceptores
│   ├── modules/             # Módulos de NestJS
│   ├── repositories/        # Repositorios de datos
│   └── strategies/          # Estrategias de Passport
├── app.controller.ts        # Controlador principal
├── app.module.ts            # Módulo principal
├── app.service.ts           # Servicio principal
├── config.ts                # Configuración de la aplicación
├── enviroments.ts           # Configuración de entornos
└── main.ts                  # Punto de entrada
```

## 🔧 Scripts Disponibles

### **Desarrollo**
```bash
npm run start              # Iniciar aplicación
npm run start:dev          # Modo desarrollo con hot-reload
npm run start:debug        # Modo debug
npm run start:prod         # Modo producción
```

### **Pruebas**
```bash
npm test                   # Ejecutar pruebas
npm run test:watch         # Pruebas en modo watch
npm run test:cov           # Pruebas con cobertura
npm run test:cov:ci        # Pruebas para CI/CD
npm run test:e2e           # Pruebas E2E
npm run test:debug         # Pruebas en modo debug
```

### **Calidad de Código**
```bash
npm run lint               # Ejecutar ESLint
npm run format             # Formatear código con Prettier
npm run coverage:check     # Verificar cobertura
```

### **Build y Deploy**
```bash
npm run build              # Compilar aplicación
npm run test:report        # Generar reporte de cobertura
```

## 📚 Documentación de la API

### **Swagger UI**
Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva en:
```
http://localhost:3000/api
```

### **Endpoints Principales**

#### **Autenticación**
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registro de usuario
- `POST /auth/forgot-password` - Recuperar contraseña

#### **Estacionamientos**
- `POST /parking/pre-enroll` - Pre-inscripción de estacionamiento

#### **Sistema**
- `GET /` - Health check
- `GET /api` - Documentación Swagger

### **Ejemplos de Uso**

#### **Login**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### **Registro**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userName": "johndoe",
    "password": "password123",
    "phone": "1234567890"
  }'
```

## 🤝 Contribución

### **Flujo de Contribución**
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### **Estándares de Código**
- ✅ Usar TypeScript
- ✅ Seguir convenciones de NestJS
- ✅ Escribir pruebas para nuevo código
- ✅ Mantener cobertura > 80%
- ✅ Usar ESLint y Prettier
- ✅ Documentar funciones complejas

### **Ejecutar Pruebas Antes de Commit**
```bash
# Verificar que todo funciona
npm run lint
npm run test:cov
npm run build
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🎯 Estado del Proyecto

| Aspecto | Estado | Descripción |
|---------|--------|-------------|
| 🚀 **Funcionalidad** | ✅ Completo | API de autenticación y gestión de usuarios |
| 🧪 **Pruebas** | ✅ Completo | 370 pruebas con 97%+ cobertura |
| 🔄 **CI/CD** | ✅ Completo | Pipeline automatizado con GitHub Actions |
| 📚 **Documentación** | ✅ Completo | README, Swagger y guías incluidas |
| 🏗️ **Arquitectura** | ✅ Completo | Clean Architecture implementada |
| 🔒 **Seguridad** | ✅ Completo | JWT, bcrypt, rate limiting |

---

<p align="center">
  <strong>Desarrollado con ❤️ usando NestJS y TypeScript</strong>
</p>