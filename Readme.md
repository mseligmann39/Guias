# Proyecto Final (TFG) - Plataforma de Guías de Videojuegos

Este es el proyecto final para el Grado Superior en **Técnico Superior en Desarrollo de Aplicaciones Web (TSDAW)**. Consiste en una aplicación web Full Stack diseñada para ser una plataforma donde los usuarios pueden consultar guías, logros y otra información relevante sobre videojuegos.

![Captura de la Página Principal]()
*<p align="center">Página principal mostrando el catálogo de juegos.</p>*

## ✨ Características Principales

### Backend (API REST con Laravel)
* **API RESTful:** Endpoints bien definidos para gestionar `Juegos`, `Categorías`, `Guías` y `Logros`.
* **Importación de Datos Reales:** Un comando de Artisan (`import:games`) que se conecta a la API externa de **RAWG.io** para poblar la base de datos con información real y actualizada de videojuegos.
* **Autenticación Segura:** Preparado para autenticación de SPA (Single Page Application) usando Laravel Sanctum.
* **Control de Acceso:** Rutas públicas para la consulta de datos y rutas protegidas que requerirán autenticación para la creación o modificación de contenido.
* **Base de Datos Relacional:** Estructura de datos bien definida con relaciones entre juegos, guías, usuarios, etc.

### Frontend (SPA con React)
* **Galería de Juegos:** Página principal que consume la API del backend para mostrar un catálogo de videojuegos con sus portadas.
* **Navegación y Rutas Dinámicas:** Uso de `react-router-dom` para navegar entre la página principal y las vistas de detalle de cada juego.
* **Vista de Detalle Completa:** Al seleccionar un juego, se muestra una página con su información detallada (descripción, fecha de lanzamiento, géneros) y los datos relacionados como guías y logros, todo cargado en paralelo para una mejor performance.
* **Arquitectura Basada en Componentes:** Código organizado, escalable y reutilizable siguiendo las mejores prácticas de React.
* **Entorno de Desarrollo Moderno:** Construido con Vite para una experiencia de desarrollo rápida y eficiente.

## 🚀 Stack Tecnológico

El proyecto sigue una arquitectura de microservicios desacoplada, con un backend que expone una API y un frontend que la consume.

| Backend | Frontend | Herramientas |
| :---: | :---: | :---: |
| **PHP 8.2+** | **React 18+** | **VS Code** |
| **Laravel 12** | **Vite** | **Git / GitHub** |
| **Laravel Sanctum** | **React Router** | **WSL (Ubuntu)** |
| **SQLite** (para desarrollo) | **Axios** | **Postman** |
| | **CSS Moderno** | |

## ⚙️ Instalación y Puesta en Marcha

Para ejecutar este proyecto en un entorno local, sigue estos pasos:

### Prerrequisitos
* PHP >= 8.2
* Composer
* Node.js >= 18.0
* NPM
* Un cliente de base de datos (opcional, ya que se usa SQLite por defecto).

### 1. Configuración del Backend (API)

```bash
# 1. Clona el repositorio
git clone https://github.com/mseligmann39/Guias.git

# 2. Navega a la carpeta del backend
cd Guias/backend

# 3. Instala las dependencias de PHP
composer install

# 4. Crea tu archivo de entorno a partir del ejemplo
cp .env.example .env

# 5. Genera la clave de la aplicación
php artisan key:generate

# 6. Obtén una API Key gratuita de [https://rawg.io/apidocs](https://rawg.io/apidocs)
#    y añádela al final de tu archivo .env
echo "RAWG_API_KEY=TU_API_KEY_AQUI" >> .env

# 7. Crea el archivo para la base de datos SQLite
touch database/database.sqlite

# 8. Ejecuta las migraciones y puebla la base de datos con datos reales
php artisan migrate:fresh --seed

# 9. Inicia el servidor del backend (normalmente en [http://127.0.0.1:8000](http://127.0.0.1:8000))
php artisan serve

```

2. Configuración del Frontend (React App)
```bash

Bash

# 1. Abre una nueva terminal y navega a la carpeta del frontend
cd Guias/frontend

# 2. Instala las dependencias de Node.js
npm install

# 3. Inicia el servidor de desarrollo de Vite (normalmente en http://localhost:5173)
npm run dev

```
¡Listo! Ahora puedes abrir http://localhost:5173 en tu navegador para ver la aplicación en funcionamiento.


🛣️ Futuras Mejoras (Roadmap)
[ ] Sistema de Autenticación Completo: Implementar los formularios de Login y Registro en el frontend para que los usuarios puedan crear cuentas.

[ ] Creación de Guías: Permitir a los usuarios autenticados crear, editar y eliminar sus propias guías para los juegos.

[ ] Sistema de Búsqueda: Añadir una barra de búsqueda en el frontend para encontrar juegos por título.

[ ] Paginación: Implementar paginación tanto en el backend como en el frontend para manejar grandes volúmenes de datos.

[ ] Perfiles de Usuario: Una página donde los usuarios puedan ver las guías que han creado.

👨‍💻 Autor
Maximiliano Seligmann

[LinkedIn](https://www.linkedin.com/in/maximiliano-seligmann/)
