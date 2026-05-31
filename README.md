# a-donde

Plataforma para descubrir y compartir lugares con recomendaciones cercanas.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **UI:** React 19, Tailwind CSS 4
- **Base de datos:** MySQL (mysql2)
- **Autenticación:** bcrypt + jose (JWT) + refresh tokens
- **Validación:** Zod

## Requisitos

- Node.js >= 20
- MySQL

## Configuración

Crear archivo `.env.local`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=a-donde
AUTH_SECRET=<tu-secreto-hex-de-128-caracteres>
```

## Scripts

```bash
npm run dev       # Desarrollo
npm run build     # Producción
npm run start     # Servir build
npm run lint      # ESLint
```

## Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/me` | Usuario actual |
| POST | `/api/auth/refresh` | Refrescar token |

### Lugares
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/lugares` | Listar lugares |
| GET | `/api/lugares/:id` | Obtener lugar |
| POST | `/api/lugares` | Crear lugar |
| PUT | `/api/lugares/:id` | Actualizar lugar |
| DELETE | `/api/lugares/:id` | Eliminar lugar |

### Categorías
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/categorias` | Listar categorías |
| GET | `/api/categorias/:id` | Obtener categoría |
| POST | `/api/categorias` | Crear categoría |
| PUT | `/api/categorias/:id` | Actualizar categoría |
| DELETE | `/api/categorias/:id` | Eliminar categoría |

### Presupuestos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/presupuestos` | Listar presupuestos |
| GET | `/api/presupuestos/:id` | Obtener presupuesto |
| POST | `/api/presupuestos` | Crear presupuesto |
| PUT | `/api/presupuestos/:id` | Actualizar presupuesto |
| DELETE | `/api/presupuestos/:id` | Eliminar presupuesto |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |
