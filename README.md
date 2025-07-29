# VEMAT API

API para el sistema de monitoreo VEMAT con documentación Swagger.

## 🚀 Deployment en Render

### Configuración automática:
1. Ve a [Render.com](https://render.com) y conecta tu cuenta de GitHub
2. Selecciona "New +" → "Blueprint"
3. Conecta tu repositorio `vemat`
4. Render detectará automáticamente el archivo `render.yaml` y configurará:
   - El servicio web (API)
   - La base de datos PostgreSQL (si es necesario)

### Variables de entorno necesarias:
```env
NODE_ENV=production
PORT=10000
DB_HOST=tu_host_de_aiven
DB_PORT=18629
DB_USER=vemat_user
DB_PASSWORD=tu_password_de_aiven
DB_NAME=vemat
```

### URLs importantes después del deployment:
- **API Base**: `https://tu-app.onrender.com`
- **Swagger UI**: `https://tu-app.onrender.com/api-docs`
- **Health Check**: `https://tu-app.onrender.com/health`

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

Este proyecto usa MySQL/MariaDB con las siguientes credenciales de Aiven Cloud.
