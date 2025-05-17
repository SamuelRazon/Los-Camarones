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

## Documentación de la API
Disponible en [GitHub Wiki](https://github.com/SamuelRazon/Los-Camarones/wiki)
