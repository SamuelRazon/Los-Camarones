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
La API de autenticación permite registrar nuevos usuarios, iniciar sesión y autenticar tokens. A continuación se describen los endpoints disponibles:

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

`GET /api/auth/check-email`

Descripción: Verifica si el correo electrónico ya está registrado

Parametros:
- email: Correo electrónico (body)

ejemplo de body:
```
{
  "email": "correo@example.com"
}
```

Respuestas:
200
```
{
  "message": "El correo ya está registrado"
}
```
409
```
{
  "message": "El correo electrónico está disponible"
}
```

errores:
- 400: Bad Request - Datos inválidos
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
### Endpoints de rubros
La API de rubros permite crear, obtener, actualizar y eliminar rubros. A continuación se describen los endpoints disponibles:

`POST /api/rubros`

Descripción: Crea un nuevo rubro

Parametros:
- nombre: Nombre del rubro
- propiedades: Propiedades del rubro (las primeras 3: "urldoc", "nombre","fecha" siempre son las mismas, pero se pueden agregar más)
- propiedadestipo: Tipo de propiedades (array de strings)
- propiedadesobligatoro: Propiedades obligatorias (array de booleanos)

Ejemplo de body:
```
{
  "nombre": "Rubro 1",
  "propiedades": ["urldoc", "nombre", "fecha"],
  "propiedadesTipo": ["string", "string", "date"],
  "propiedadesObligatorias": [true, true, true]
}
```
```
{
  "nombre": "tesis",
  "propiedades": ["urldoc", "nombre","fecha","titulo", "año", "doi"],
  "propiedadtipo": ["string","string", "date", "string", "string", "string"],
  "propiedadesobligatorio": [true,true,true,true,false,true]
}
```
Respuesta:
```
{
    "usuarioId": "67ef497b618aa965ca557024",
    "nombre": "tesis",
    "propiedades": [
        "urldoc",
        "nombre",
        "fecha",
        "titulo",
        "año",
        "doi"
    ],
    "propiedadtipo": [
        "string",
        "string",
        "date",
        "string",
        "string",
        "string"
    ],
    "propiedadobligatorio": [],
    "_id": "67f1f0d54bfaaa694266f1cd",
    "__v": 0
}
```

Posibles errores:
- 400: Bad Request - Datos inválidos
- 401: Unauthorized - Acceso denegado
- 500: Internal Server Error - Error en el servidor
---
`GET /api/rubros`
Descripción: Devuelve todos los rubros del usuario autenticado

Parametros: Requiere token de autenticación en el encabezado

Ejemplo de body: Ninguno

Respuesta:
```
[
    {
        "_id": "67f1f0d54bfaaa694266f1cd",
        "usuarioId": "67ef497b618aa965ca557024",
        "nombre": "tesis",
        "propiedades": [
            "urldoc",
            "nombre",
            "fecha",
            "titulo",
            "año",
            "doi"
        ],
        "propiedadesTipo": [
            "string",
            "string",
            "date",
            "string",
            "string",
            "string"
        ],
        "propiedadesObligatorias": [
            true,
            true,
            true,
            true,
            false,
            true
        ],
        "__v": 0
    }
]
```

Posibles errores:
- 401: Unauthorized - Acceso denegado
- 500: Internal Server Error - Error en el servidor
---

`GET /api/rubros/:id`

Descripción: Devuelve un rubro específico del usuario autenticado

Parametros:
- id: ID del rubro
Requiere token de autenticación en el encabezado

Ejemplo de body: Ninguno

Respuesta:
```
{
    "_id": "67f1f0d54bfaaa694266f1cd",
    "usuarioId": "67ef497b618aa965ca557024",
    "nombre": "tesis",
    "propiedades": [
        "urldoc",
        "nombre",
        "fecha",
        "titulo",
        "año",
        "doi"
    ],
    "propiedadesTipo": [
        "string",
        "string",
        "date",
        "string",
        "string",
        "string"
    ],
    "propiedadesObligatorias": [
        true,
        true,
        true,
        true,
        false,
        true
    ],
    "__v": 0
}
```

Posibles errores:
- 401: Unauthorized - Acceso denegado
- 404: Not Found - Rubro no encontrado
- 500: Internal Server Error - Error en el servidor
---

`PUT /api/rubros/:id`

Descripción: Actualiza un rubro específico del usuario autenticado

Parametros:
- id: ID del rubro

body:
- nombre: Nombre del rubro
- propiedades: Propiedades del rubro (las primeras 3: "urldoc", "nombre","fecha" siempre son las mismas, pero se pueden agregar más)
- propiedadestipo: Tipo de propiedades (array de strings)
- propiedadesobligatoro: Propiedades obligatorias (array de booleanos)

Ejemplo de body:
```
{
  "nombre": "Rubro 1",
  "propiedades": ["urldoc", "nombre", "fecha"],
  "propiedadesTipo": ["string", "string", "date"],
  "propiedadesObligatorias": [true, true, true]
}
```
```
{
  "nombre": "tesis",
  "propiedades": ["urldoc", "nombre","fecha","titulo", "año", "doi"],
  "propiedadtipo": ["string","string", "date", "string", "string", "string"],
  "propiedadesobligatorio": [true,true,true,true,false,true]
}
```

Respuesta:
```
{
    "_id": "67f1efa74bfaaa694266f1cb",
    "usuarioId": "67ef497b618aa965ca557024",
    "nombre": "tesis",
    "propiedades": [
        "urldoc",
        "nombre",
        "fecha",
        "titulo",
        "año",
        "DOI"
    ],
    "propiedadtipo": [
        "string",
        "string",
        "date",
        "string",
        "string",
        "string"
    ],
    "propiedadobligatorio": [],
    "__v": 1
}
```

Posibles errores:
- 400: Bad Request - Datos inválidos
- 401: Unauthorized - Acceso denegado
- 404: Not Found - Rubro no encontrado
- 500: Internal Server Error - Error en el servidor
---

`DELETE /api/rubros/:id`

Descripción: Elimina un rubro específico del usuario autenticado

Parametros:
- id: ID del rubro

Body: Ninguno

Ejemplo de body: Ninguno

Respuesta:
```
{
    "message": "Rubro eliminado con éxito"
}
```

Posibles errores:
- 401: Unauthorized - Acceso denegado
- 404: Not Found - Rubro no encontrado
- 500: Internal Server Error - Error en el servidor
---
