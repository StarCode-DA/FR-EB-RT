# 🌙 Eclipse Bar — Frontend

Interfaz web del sistema de gestión **Eclipse Bar**, construida con React y Bootstrap. Permite a los usuarios gestionar y tener accesos del sistema.

---

## 📋 Tabla de contenido

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Autenticación](#autenticación)
- [Conexión con microservicios](#conexión-con-microservicios)

---

## 🛠 Tecnologías

- [React](https://react.dev/) — Librería principal de UI
- [React Router DOM](https://reactrouter.com/) — Navegación entre páginas
- [React Bootstrap](https://react-bootstrap.netlify.app/) — Componentes de UI
- [Axios](https://axios-http.com/) — Cliente HTTP
- [React Toastify](https://fkhadra.github.io/react-toastify/) — Notificaciones
- [React Bootstrap Icons](https://github.com/ismamz/react-bootstrap-icons) — Iconos

---

## ✅ Requisitos previos

- Node.js >= 18
- npm >= 9
- Los microservicios corriendo

---

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd frontend

# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Construir para producción
npm run build
```

---

## 🔧 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_MS_AUTH_URL=http://localhost:8001/auth
VITE_MS_USER_URL=http://localhost:8002/usuarios
```

Estas variables se consumen desde `src/config.js`:

```js
export const MS_AUTH_URL = import.meta.env.VITE_MS_AUTH_URL;
export const MS_USER_URL = import.meta.env.VITE_MS_USER_URL;
```

---

## 📁 Estructura del proyecto

```
src/
├── components/         # Componentes reutilizables
│
├── context/
│
├── pages/              # Páginas principales
│   ├── Login.jsx
│   ├── ForgotPassword.jsx
│   ├── Home.jsx
│   └── Users.jsx
├── services/
│   └── api.js          # Cliente HTTP y servicios
├── config.js           # URLs de microservicios
├── App.jsx
└── main.jsx
```

---

## ✨ Funcionalidades

### Autenticación
- Inicio de sesión con email y contraseña
- Recuperación de contraseña mediante pregunta de seguridad
- Cierre de sesión
- Validación de contraseña: mínimo 8 caracteres, una mayúscula, una minúscula y un número

### Gestión de usuarios *(solo administrador)*
- Crear usuarios con rol: `mesero`, `cajero` o `administrador`
- Editar información de usuarios existentes
- Activar / Desactivar usuarios
- Buscar usuarios por nombre
- Filtrar usuarios por sede o por rol administrador

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)**. Al iniciar sesión:

1. El token se almacena en `localStorage`.
2. Se adjunta automáticamente en cada petición mediante un interceptor de Axios.
3. Si el token expira o es inválido (error 401), el usuario es redirigido al login automáticamente.
4. Al cargar la app, se llama al endpoint `/auth/me` para obtener el nombre del usuario autenticado.

---

## 🔗 Conexión con microservicios

El frontend consume # microservicios:

| Microservicio | Puerto por defecto | Prefijo     |
|---------------|--------------------|-------------|
| `eb-auth`     | 8001               | `/auth`     |
| `eb-user`     | 8002               | `/usuarios` |

### Endpoints utilizados

**Auth (`eb-auth`)**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| GET | `/auth/me` | Obtener datos del usuario autenticado |
| GET | `/auth/security-question` | Obtener pregunta de seguridad |
| POST | `/auth/forgot-password` | Restablecer contraseña |

**Usuarios (`eb-user`)**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/usuarios/` | Crear usuario |
| GET | `/usuarios/` | Listar usuarios |
| PUT | `/usuarios/{id}` | Actualizar usuario |
| PATCH | `/usuarios/{id}/toggle-activo` | Activar/Desactivar usuario |
