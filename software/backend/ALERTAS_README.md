# 📧 Sistema de Alertas Automáticas VEMAT

## 🎯 Descripción
Sistema automático de monitoreo y alertas por correo electrónico que analiza continuamente las últimas 9 lecturas ambientales y envía notificaciones cuando detecta condiciones favorables para la proliferación de mosquitos.

## ⚙️ Configuración

### 1. Variables de Entorno
Agregar al archivo `.env`:
```env
# Configuración de email
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Configurar Gmail App Password
1. Ve a tu cuenta de Google → Seguridad
2. Activa la verificación en 2 pasos
3. Genera una "Contraseña de aplicación"
4. Usa esa contraseña en `EMAIL_PASS`

### 3. Base de Datos
Ejecutar el script SQL:
```bash
mysql -h your-host -u your-user -p your-database < database/alertas_table.sql
```

## 🔍 Funcionamiento

### Análisis Automático
- **Frecuencia:** Cada 10 minutos
- **Criterio:** Analiza las últimas 9 lecturas
- **Condiciones favorables:**
  - Temperatura: 26-30°C
  - Humedad: >65%
  - CO2: 50-200 ppm

### Control de Spam
- **Cooldown:** 30 minutos entre alertas
- **Registro:** Todas las alertas se guardan en BD

## 📡 Endpoints API

### GET /api/alertas/status
Información del estado del sistema
```json
{
  "active": true,
  "lastAlertSent": "2025-08-18T10:30:00.000Z",
  "cooldownRemaining": 15,
  "thresholds": {
    "temperatura": {"min": 26, "max": 30},
    "humedad": {"min": 65, "max": "Infinity"},
    "co2": {"min": 50, "max": 200}
  }
}
```

### POST /api/alertas/check
Forzar análisis manual
```json
{
  "success": true,
  "alertSent": true,
  "message": "Alerta enviada exitosamente",
  "timestamp": "2025-08-18T10:30:00.000Z"
}
```

### GET /api/alertas/history
Historial de alertas enviadas
```json
{
  "success": true,
  "alerts": [
    {
      "id": 1,
      "nodo_id": "node-01",
      "tipo": "CONDICIONES_FAVORABLES",
      "detalles": "Temp: 28.5°C, Hum: 72.3%, CO2: 145.2ppm",
      "fecha_envio": "2025-08-18T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

## 📧 Formato del Email

### Destinatario
- **Principal:** chrishg2004@gmail.com

### Contenido
- ✅ Promedios de las últimas 9 lecturas
- ✅ Información del nodo y ubicación
- ✅ Fecha y hora de la última lectura
- ✅ Recomendaciones de acción
- ✅ Link al dashboard

## 🚀 Instalación

### 1. Instalar dependencias
```bash
cd software/backend
npm install nodemailer
```

### 2. Ejecutar la tabla de alertas
```sql
-- En tu base de datos MySQL
source database/alertas_table.sql
```

### 3. Configurar variables de entorno
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Reiniciar el servidor
```bash
npm start
```

## 🔧 Testing

### Manual
```bash
curl -X POST https://vemat.onrender.com/api/alertas/check
```

### Estado del sistema
```bash
curl https://vemat.onrender.com/api/alertas/status
```

### Historial
```bash
curl https://vemat.onrender.com/api/alertas/history
```

## 📊 Monitoreo

### Logs del servidor
```
🔍 Analizando condiciones para alertas automáticas...
✅ Condiciones normales - No se requiere alerta
📧 Alerta enviada exitosamente
⏳ Alerta en cooldown. Faltan 15 minutos
```

### Dashboard
- **URL:** https://vemat-frontend.onrender.com
- **API Docs:** https://vemat.onrender.com/api-docs

## ⚠️ Consideraciones

1. **Gmail Limits:** Gmail permite ~100 emails/día con app passwords
2. **Cooldown:** Previene spam con 30min entre alertas
3. **Backup:** Todas las alertas se registran en BD
4. **Manual Override:** Se puede forzar análisis con `/check`

## 🔄 Mantenimiento

### Ajustar umbrales
Modificar en `routes/alertas.js`:
```javascript
const FAVORABLE_THRESHOLDS = {
  temperatura: { min: 26, max: 30 },
  humedad: { min: 65, max: Infinity },
  co2: { min: 50, max: 200 }
};
```

### Cambiar frecuencia
Modificar intervalo en `routes/alertas.js`:
```javascript
setInterval(analyzeAndAlert, 10 * 60 * 1000); // 10 minutos
```

### Agregar destinatarios
Modificar en función `sendEmailAlert`:
```javascript
to: 'chrishg2004@gmail.com, otro@email.com',
```

---

**Sistema desarrollado para VEMAT - Vigilancia Ecológica de Mosquitos con Asistencia Tecnológica**
