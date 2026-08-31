# ResctPet - Mascotas Perdidas y Encontradas

Plataforma web para la centralización, difusión y búsqueda asistida de mascotas perdidas y encontradas.

Diseñada para reemplazar la información dispersa en redes sociales y sitios municipales: búsqueda por cercanía geográfica (radio de 5 km), mapa interactivo y sugerencia de coincidencias visuales mediante Inteligencia Artificial (Embeddings + Similitud Coseno).

---

## Stack Tecnológico

* Frontend: React 19 + JavaScript/TypeScript + Vite 6 + Tailwind CSS 4 + Leaflet 5 + Motion
* Backend: Spring Boot 3.3 + Java 17 + Spring Data JPA + Hibernate 6.5 + Maven (Arquitectura en 3 Capas: presenter, business, model/repository)
* Base de Datos: PostgreSQL 16 + Extensiones Geoespaciales PostGIS 3.4
* Microservicio IA (CBIR): Python 3.11 + FastAPI + PyTorch (ResNet50 CPU) + Uvicorn
* Testing & QA: Node.js 20 + Cucumber.js + Chai + Supertest (BDD Gherkin)
* Infraestructura: Docker + Docker Compose

---

## Requisitos

* Docker 24+ y Docker Compose instalados en el sistema.

---

## Instrucciones de Inicio y Uso Local

### 1. Primera Vez (Construcción Inicial)

Para clonar el repositorio, configurar las variables y construir las imágenes por primera vez:

```bash
# 1. Clonar el repositorio
git clone https://github.com/agusgigliottifarias/ResctPet-Mascotas-perdidas
cd ResctPet-Mascotas-perdidas

# 2. Copiar la plantilla de entorno y completar los datos
cp .env.example .env

# 3. Dar permisos de ejecución al script lpl
chmod +x ./lpl

# 4. Construir las imágenes por primera vez
./lpl build
```

### 2. Levantar los Servidores

Para iniciar todos los servicios del proyecto en segundo plano:

```bash
./lpl up
```

*(En caso de que el frontend no inicie automáticamente en la primera ejecución por falta de dependencias, ejecutar:* `docker compose run --rm frontend npm install`)

### 3. Detener los Servidores

```bash
./lpl down
```

---

## Servicios y Puertos

| Servicio | Puerto | Descripción |
| :--- | :---: | :--- |
| Frontend | http://localhost:4200 | Aplicación Web (React 19 + Vite + Tailwind CSS) |
| Backend | http://localhost:8080 | API REST en Spring Boot (Java 17) |
| Base de Datos | localhost:5432 | PostgreSQL 16 con extensión geoespacial PostGIS 3.4 |
| Servicio IA | http://localhost:8000/health | Microservicio de Embeddings y Similitud Coseno (PyTorch ResNet50 + FastAPI) |

---

## Estructura del Proyecto

```text
ResctPet-Mascotas-perdidas/
├── lpl                 # Script helper para comandos de Docker
├── frontend/cli/       # Aplicación web React 19 + Vite + Tailwind CSS
├── backend/            # API REST Spring Boot (Java 17) estructurada en 3 capas
├── embedding-service/  # Microservicio de IA para Embeddings y Similitud Coseno 
├── testing/            # Pruebas automatizadas BDD (Cucumber.js)
├── docker-compose.yml  
├── .env.example        # Plantilla pública de variables de entorno
└── .gitignore          
```

---


