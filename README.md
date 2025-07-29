# VEMAT API

API para el sistema de monitoreo VEMAT con documentación Swagger.

## 🚀 Deployment en Render

### Configuración manual:
1. Ve a [Render.com](https://render.com) y conecta tu cuenta de GitHub
2. Selecciona "New +" → "Web Service"
3. Conecta tu repositorio `vemat`
4. Configura:
   - **Name**: `vemat-api`
   - **Region**: Selecciona la más cercana
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Variables de entorno necesarias en Render:
```env
NODE_ENV=production
PORT=10000
DB_HOST=tu_host_de_aiven_cloud
DB_PORT=tu_puerto_de_aiven
DB_USER=tu_usuario_de_aiven
DB_PASSWORD=tu_password_de_aiven
DB_NAME=vemat
```

### URLs importantes después del deployment:
- **API Base**: `https://tu-app.onrender.com`
- **Swagger UI**: `https://tu-app.onrender.com/api-docs`
- **Health Check**: `https://tu-app.onrender.com/health`
- **Rutas disponibles**:
  - `GET /api/lecturas` - Obtener lecturas de sensores
  - `POST /api/geo` - Enviar datos de geolocalización

## 🔧 Desarrollo local

1. Copia `.env.example` a `.env`
2. Configura tus variables de entorno
3. Ejecuta:
```bash
cd backend
npm install
npm run dev
```

## 📚 Documentación API

La documentación completa está disponible en `/api-docs` cuando el servidor está ejecutándose.

## 🗄️ Base de datos

Este proyecto usa MySQL/MariaDB con credenciales de Aiven Cloud.

## 🔧 Dependencias principales

- **Express**: Framework web
- **MySQL2**: Conexión a base de datos
- **Swagger**: Documentación API
- **Axios**: Cliente HTTP para geolocalización
- **CORS**: Configuración de cross-origin
