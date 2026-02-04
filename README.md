# POST CV - Backend API

SaaS para optimización de CVs con Inteligencia Artificial.

## Descripción

POST CV analiza currículums usando OpenAI para:
- Dar un **ATS Score** (qué tan compatible es con sistemas de reclutamiento)
- Comparar el CV contra **descripciones de trabajo** específicas
- **Reescribir bullet points** con métricas y verbos de acción (Premium)
- **Exportar PDFs** con templates profesionales (Premium)

---

## Requisitos básicos

- **Node.js** v18 o superior
- **PostgreSQL** v14 o superior
- **npm** v9 o superior

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd cv-optimizer
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copia y edita el archivo de ejemplo con tus propias variables de entorno
cp .env.example .env
```

### 4. Crear la base de datos

```bash
# Entra a PostgreSQL
psql -U postgres

# Crea la base de datos y el usuario
CREATE DATABASE cv_optimizer;
CREATE USER cv_admin WITH PASSWORD 'password'; 
GRANT ALL PRIVILEGES ON DATABASE cv_optimizer TO cv_admin;
```

### 5. Ejecutar migraciones de Prisma

```bash
# Genera el cliente de Prisma
npm run db:generate

# Aplica las migraciones
npm run db:migrate
```

### 6. Iniciar el servidor

```bash
# Desarrollo (con hot-reload por el uso de nodemon)
npm run dev

# Producción
npm start
```

El servidor estará en: `http://localhost:3000`

---

## Scripts Disponibles

| Script                 | Descripción                                 |
|------------------------|---------------------------------------------|
| `npm run dev`          | Inicia el servidor con nodemon (hot-reload) |
| `npm start`            | Inicia el servidor en modo producción       |
| `npm run db:generate`  | Genera el cliente de Prisma                 |
| `npm run db:migrate`   | Ejecuta migraciones pendientes              |
| `npm run db:studio`    | Abre Prisma Studio (GUI para la BD)         |

---

## API Endpoints

### Autenticación

Todas las rutas protegidas requieren el header `Authorization`:

Authorization: Bearer <tu-jwt-token>

El token se obtiene al hacer login o register.

| Método | Ruta                 | Descripción     | Auth |
|--------|----------------------|-----------------|------|
| POST   | `/api/auth/register` | Crear cuenta    | No   |
| POST   | `/api/auth/login`    | Iniciar sesión  | No   |
| GET    | `/api/auth/profile`  | Obtener usuario | Sí   |

### CVs

| Método | Ruta                  | Descripción                  | Auth |
|--------|-----------------------|------------------------------|------|
| POST   | `/api/cv/upload`      | Subir CV (PDF/DOCX)          | Sí |
| GET    | `/api/cv`             | Listar CVs del usuario       | Sí |
| GET    | `/api/cv/:id`         | Ver detalle de un CV         | Sí |
| DELETE | `/api/cv/:id`         | Eliminar un CV               | Sí |
| POST   | `/api/cv/:id/analyze` | Analizar CV (ATS Score)      | Sí |
| POST   | `/api/cv/:id/match`   | Comparar con job description | Sí |
| POST   | `/api/cv/:id/rewrite` | Reescribir bullets (Premium) | Sí |
| POST   | `/api/cv/:id/export`  | Exportar PDF (Premium)       | Sí |

### Pagos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/payments/checkout` | Crear sesión de Stripe | Sí |
| POST | `/api/payments/webhook` | Webhook de Stripe | No |

---

## Features 

- [✅] **Feature 1:** Registro y Login usando JWT
- [ ] **Feature 2:** Subir CV (PDF/DOCX → texto)
- [ ] **Feature 3:** ATS Score con OpenAI
- [ ] **Feature 4:** Job Description Matching
- [ ] **Feature 5:** Integración con Stripe
- [ ] **Feature 6:** AI Bullet Rewriter (Premium)
- [ ] **Feature 7:** Template Rendering + PDF Export (Premium)
- [ ] **Feature 8:** CRUD completo de CVs

---

## Modelos de Base de Datos

### User

| Campo                | Tipo      | Descripción                   |
|----------------------|-----------|-------------------------------|
| id                   | UUID      | Identificador único           |
| name                 | String    | Nombre del usuario            |
| email                | String    | Email (único)                 |
| password             | String    |  Contraseña hasheada          |
| plan                 | Enum      | FREE, PRO_MONTHLY, PRO_ANNUAL |
| matchesUsedThisMonth | Int       | Comparaciones usadas este mes |
| stripeCustomerId     | String?   | ID de cliente en Stripe       |
| stripeSubscriptionId | String?   | ID de suscripción en Stripe   |
| planExpiresAt        | DateTime? | Fecha de expiración del plan  |

### Cv

| Campo              | Tipo   | Descripción                           |
|--------------------|--------|---------------------------------------|
| id                 | UUID   | Identificador único                   |
| userId             | UUID   | ID del usuario dueño                  |
| title              | String | Título/nombre del CV                  |
| originalContent    | Text   | Texto extraído del CV                 |
| optimizedContent   | Text?  | CV reescrito (Premium)                |
| fileType           | String | "pdf" o "docx"                        |
| status             | Enum   | PENDING, ANALYZING, COMPLETED, FAILED |
| overallScore       | Int?   | Score ATS (0-100)                     |
| categoryScores     | JSON?  | Scores por categoría                  |
| problems           | JSON?  | Lista de problemas encontrados        |
| lastMatchRate      | Int?   | Último % de match con job description |
| lastJobDescription | Text?  | Última job description comparada      |

---