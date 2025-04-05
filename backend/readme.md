# Backend de Shrimp Shelf

## Instalación y configuración
1. Clonar el repositorio
  ```
  git clone https://github.com/usuario/nombre-del-repo.git
  cd nombre-del-repo/backend
  ```

2. Instalar dependencias
  ```
  npm install
  ```

3. Configurar variables de entorno
  Crea un archivo .env en la raíz del proyecto con las siguientes variables:

  ```
  PORT=5000
  MONGO_URI=mongodb+srv://Root:Pablito432@programmingforinternet.c8pewun.mongodb.net/
  JWT_SECRET=clave_secreta
  ```
  Si usas MongoDB Atlas, reemplaza MONGO_URI con tu cadena de conexión.

4. Ejecutar el servidor

  Modo desarrollo:
  ```
  npm run dev
  ```
  Modo producción:
  ```
  npm start
  ```

## Uso básico de la API
### Endpoints de registro, ingreso y autenticación
---
`GET /api/auth/register`

Descripción: Registra un nuevo usuaro en la base de datos

Parametros:
- username: Nombre de usuario
- email: Correo electrónico
- password: Contraseña
- foto: URL de la foto de perfil (opcional)


Ejemplo de body:
```
  "username": "usuario2",
  "email": "correo2@example.com",
  "password": "123456"
```
Respuesta:
```
{
  "message": "Usuario registrado exitosamente"
}
```
Posibles errores:
- 400: Bad Request - Datos inválidos
- 409: Conflict - El usuario ya existe
- 500: Internal Server Error - Error en el servidor
---
`POST /api/auth/login`

Descripción: Inicia sesión y devuelve un token de autenticación
Parametros:
- email: Correo electrónico
- password: Contraseña	
Ejemplo de body:
```
{
  "email": "correo@example.com",
  "password": "123456"
}
```
Respuesta:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWY0OTdiNjE4YWE5NjVjYTU1NzAyNCIsImlhdCI6MTc0Mzg5MDA4OCwiZXhwIjoxNzQzODkzNjg4fQ.Xrp3BvmWOFmiAfIgXAaqSc9Lqx49AbShjHyuzVD79eU",
    "user": {
        "id": "67ef497b618aa965ca557024",
        "username": "usuario2",
        "correo": "correo2@example.com"
    }
}
```

Posibles errores:
- 400: Bad Request - Datos inválidos
- 401: Unauthorized - Credenciales incorrectas
- 500: Internal Server Error - Error en el servidor
---
`GET /api/auth/logout`
Descripción: Cierra sesión y elimina el token de autenticación
Parametros: Ninguno
Ejemplo de body: Ninguno
Respuesta:
```
{
  "message": "Sesión cerrada exitosamente"
}
```
Posibles errores:
- 401: Unauthorized - No se ha iniciado sesión
- 500: Internal Server Error - Error en el servidor
---
`GET /api/auth/`
Descripción: Autentica que el token es válido
Parametros: Requiere token de autenticación en el encabezado
Ejemplo de body: Ninguno
Respuesta:
```
{
    "message": "Token válido",
    "user": {
        "id": "67ef497b618aa965ca557024",
        "username": "usuario2",
        "correo": "correo2@example.com"
    }
}
```
Posibles errores:
- 401: Unauthorized - Token inválido o expirado
- 500: Internal Server Error - Error en el servidor
---
`GET /api/auth/perfil`
Descripción: Devuelve la información del usuario autenticado
Parametros: Requiere token de autenticación en el encabezado
Ejemplo de body: Ninguno
Respuesta:
```
{
    "_id": "67ef497b618aa965ca557024",
    "correo": "correo2@example.com",
    "username": "usuario2",
    "foto": "",
    "rubrosDefault": [],
    "rubrosPersonalizados": [],
    "__v": 0
}
```
Posibles errores:
- 401: Unauthorized - Acceso denegado
- 500: Internal Server Error - Error en el servidor
---



