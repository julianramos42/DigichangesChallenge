# Digichanges Challenge

Este proyecto es una aplicación Fullstack que permite explorar datos del universo de Star Wars, usando información extraída de la Star Wars API ([SWAPI](https://swapi.dev/)). La aplicación consiste en una RESTful API desarrollada en Node.js con TypeScript para el backend y un frontend en Next.js, también en TypeScript. Los datos se almacenan y sincronizan en MongoDB a través de un cron job.

## Objetivos del Proyecto
* Crear una sincronización de información mediante un cron job que guarda los datos de SWAPI en una base de datos MongoDB.
* Implementar los siguientes endpoints para recuperar información de la base de datos:
  - **People**
  - **Films**
  - **Starships**
  - **Planets**
* Cada endpoint permite filtrar la información por al menos un atributo.
* Desarrollar una interfaz de usuario intuitiva y responsiva, que permita:
  - Listar las entidades mencionadas.
  - Ver en detalle la información de cada elemento.
  - Paginar los resultados y realizar búsquedas locales.

## Tecnologías Utilizadas
- **Backend**: Node.js, Express, MongoDB (ODM: Mongoose), TypeScript.
- **Frontend**: Next.js, TypeScript, Tailwind CSS.
- **Otras Librerías**: Axios para el consumo de API, node-cron para el cron job, Jest para pruebas unitarias.

## Funcionalidades Clave

### Backend
* **Cron Job**: Ejecuta una sincronización periódica con SWAPI, actualizando los datos en MongoDB.
* **Endpoints**: Cada endpoint de listado permite filtrar la información y obtener datos específicos.
* **Pruebas Unitarias**: Los tests unitarios garantizan la funcionalidad del backend, usando Jest.

### Frontend
* **Interfaz de Usuario**: Diseñada con Tailwind CSS, ofrece una experiencia intuitiva y responsive.
* **Vistas**: Incluye una vista de listado y una vista de detalles para cada entidad.
* **Paginación y Búsqueda**: Implementadas en los listados para una navegación rápida y eficiente.

## Criterios Técnicos
Este proyecto sigue lineamientos estrictos para asegurar un código limpio y escalable:
* El archivo `.env` no se encuentra en el repositorio.
* No se permite el uso de `any` en TypeScript.
* Los schemas de MongoDB no se importan directamente en los controladores.

## Despliegue
* **Backend**: Desplegado en Render.
* **Frontend**: Desplegado en Vercel.

## Instalación
1. Clona el repositorio.
2. Configura tu archivo `.env` en el backend.

Instala las dependencias:

```bash
# En el directorio backend
npm install
npm run tsc

# En el directorio frontend
npm install
```

## Ejecuta la aplicación
1. Backend:
* Variables de entorno: 
  - MONGO_DATABASE_URL (CONEXION BDD)
  - PORT (PUERTO A UTILIZAR)
  - OUR_URL (URL DEL BACK A UTILIZAR, LOCALHOST O DOMINIO. Ej: "http://localhost:8080" sin la / final)
* npm start (o npm run dev para desarrollo).

3. Frontend:
* Variables de entorno:
  - NEXT_PUBLIC_API_URL (URL A LAS QUE SE HACEN LAS PETICIONES. Ej: "http://localhost:8080/api" sin la / final)
* npm run dev.

## Ejecución de Tests
Para ejecutar los tests unitarios en el backend, utiliza el siguiente comando:

```bash
npm test
```

## Criterio de Evaluación
Este proyecto se evaluará en base a:
* Cumplimiento de funcionalidades.
* Calidad y organización del código.
* UX/UI.
* Pruebas unitarias exhaustivas.
