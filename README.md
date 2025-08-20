# VEMAT - Vigilancia Ecológica de Mosquitos con Asistencia Tecnológica

## 🎯 **ESTADO DEL PROYECTO: COMPLETADO Y EN PRODUCCIÓN** ✅

**Sistema 100% funcional y desplegado en la nube - Listo para presentación**

### 🌐 **Enlaces del Sistema en Vivo:**
- **🔗 API Backend:** https://vemat.onrender.com
- **📖 Documentación API:** https://vemat.onrender.com/api-docs/
- **💻 Dashboard Frontend:** https://vemat-frontend.onrender.com
- **📊 Estado:** Sistema operativo 24/7 desde Agosto 2025

---

## 1. Información del Proyecto

**Nombre del Proyecto:** VEMAT (Vigilancia Eco-epidemiológica de Mosquitos con Asistencia Tecnológica)

**Título Completo:** "MONITORIZACIÓN AMBIENTAL INTELIGENTE PARA LA PREVENCIÓN DE ENFERMEDADES VECTORIALES: DETECCIÓN DE HÁBITATS DE MOSQUITOS EN ALCANTARILLADOS URBANOS UTILIZANDO ARDUINO Y SENSORES"

**Equipo:** 
- Christofer Hernández García 
- Jose Pablo Rodriguez Centeno
- Brad Danny Monge Madrigal
- Jefferson Rodriguez Gonzalez

**Roles:**
- **Christofer:** Desarrollo de Hardware y Sensores (ESP32/Arduino), Backend API
- **Jose Pablo:** Desarrollo Backend, Base de Datos, Integración IA (Google Gemini)
- **Jefferson:** Análisis de Datos y Modelos Predictivos, Frontend
- **Brad:** Frontend y Dashboard de Monitoreo, UX/UI

## 2. Descripción y Justificación

**Problema que se aborda:**
Problema que se aborda: Las enfermedades transmitidas por mosquitos (Dengue, Zika, Chikungunya, entre otras) representan un problema de salud pública significativo en entornos urbanos. Los sistemas de alcantarillado, tanto pluvial como sanitario, son conocidos por ser refugios ideales para la reproducción y supervivencia de estos vectores debido a sus condiciones ambientales específicas. La falta de información en tiempo real sobre estas condiciones dificulta la implementación de estrategias de control y prevención efectivas.

**Importancia y contexto:**
Los mosquitos son transmisores de enfermedades arbovirales, y utilizan durante el día los alcantarillados urbanos como refugios debido a las condiciones de temperaturas y humedad relativa que podrían imperar en esos sitios lo cual los hace idóneos. El monitoreo continuo de estas condiciones ambientales permitiría, predecir y prevenir brotes de enfermedades vectoriales principalmente en entornos urbanos, protegiendo la salud de las personas y maximizando los recursos económicos y humanos en salud pública destinados al control de vectores.

**Usuarios/beneficiarios:**
- Autoridades de salud pública
- Gobiernos locales y municipales
- Comunidades urbanas en riesgo
- Investigadores en epidemiología y control vectorial universitarios 
- Organizaciones de prevención sanitaria

## 3. Objetivos del Proyecto

**Objetivo General:**
Objetivo General: Desarrollar un sistema de monitoreo ambiental basado en el uso de tecnología Arduino y sensores para la identificación y predicción de las condiciones ambientales que influyen directamente en la proliferación de las poblaciones mosquitos transmisores de enfermedades vectoriales presentes en alcantarillados urbanos, como estrategia de prevención y control.

**Objetivos Específicos:**
1.	Diseñar estaciones de monitoreo autónomas utilizando ESP32/Arduino para la recolección de datos ambientales clave (temperatura, bioacuática de vuelo, humedad relativa, dióxido de carbono y gases relevantes) en salidas de alcantarillas urbanas. 
2.	Construir una API REST para la recepción, almacenamiento y gestión de datos de sensores ambientales registrados 
3.	Crear una base de datos para el almacenamiento y gestión de la información ambiental registrada a través del sensor 
4.	Desarrollar un modelo de predicción que correlacione las variables ambientales para la determinación de presencia de mosquitos vectores
5.	Generar visualizaciones y reportes de las condiciones ambientales presentes en los sitios de monitoreo para la predicción del nivel riesgo que facilite la toma de decisiones por parte de las autoridades de salud pública. 
6.	Evaluar la viabilidad y efectividad operativa del sistema en un entorno urbano bajo condiciones ambientales reales. 


## 4. Requisitos Iniciales

Lista de lo que el sistema debe lograr:

**Requisito 1:** El sistema debe tener la capacidad de registrar datos temperatura de aire, humedad relativa, CO2, bioacuática de vuelo y gases volátiles en tiempo real en estaciones ubicadas en salidas de alcantarillas urbanas
**Requisito 2:** Las estaciones deben ser autónomas, resistentes al agua y transmitir datos vía WiFi a un sistema central
**Requisito 3:** La API debe almacenar datos ambientales en base de datos MySQL y proporcionar endpoints REST documentados para análisis
**Requisito 4:** El sistema debe generar alertas automáticas cuando las condiciones ambientales indiquen alto riesgo de proliferación de mosquitos vectores
**Requisito 5:** Debe incluir un dashboard para visualización de datos ambientales, predicciones de riesgo y reportes para autoridades de salud pública

## 5. Diseño Preliminar del Sistema

**Arquitectura inicial:**
```
[Estaciones de Monitoreo en Alcantarillas]
         ↓
[ESP32 + Sensores Ambientales] → [WiFi] → [API REST] → [Base de Datos MySQL]
                                               ↓
[Dashboard Autoridades Salud] ← [Modelo Predictivo] ← [Análisis de Riesgo Vectorial]
```

**Componentes previstos:**

**Microcontrolador:**
- ESP32 con WiFi integrado para transmisión de datos
- Arduino Nano como alternativa para prototipado
- Carcasa impermeable para instalación en alcantarillas

**Sensores especializados:**
- **Sensor de Temperatura y Humedad:** BME280 o DHT22 (condiciones ideales para mosquitos: 25-30°C, >60% humedad)
- **Sensor de CO2:** MH-Z19B (los mosquitos son atraídos por CO2 exhalado por hospedadores)
- **Sensor de Gases Volátiles:** MQ-135 (detección de gases de alcantarillado y materia orgánica)
- **Sensor de Presión Atmosférica:** Integrado en BME280 (influye en actividad de mosquitos)

**Sistema de Análisis:**
- API REST desarrollada en Node.js + Express
- Base de datos MySQL para almacenamiento de datos ambientales
- Modelo predictivo para correlacionar condiciones ambientales con riesgo de mosquitos vectores
- Sistema de alertas para autoridades de salud

**Librerías y herramientas implementadas:**
- **Backend:** Express, MySQL2, Swagger, Axios, Google Gemini API, Nodemailer, node-cron
- **Frontend:** React 18, Vite, Tailwind CSS, Chart.js, Recharts, Leaflet, React Router
- **Hardware:** Arduino IDE, bibliotecas DHT22, MH-Z19B, MQ-135, NeoPixel WS2812B
- **IA y Análisis:** Google Gemini Pro para análisis epidemiológico vectorial
- **Base de datos:** MySQL 8.0 en Aiven Cloud con almacenamiento persistente
- **Deployment:** Render.com con alta disponibilidad y auto-deploy desde GitHub
- **Monitoreo:** Sistema de alertas automáticas vía email (8:00 AM y 5:10 PM Costa Rica)

## 6. Plan de Trabajo

**Cronograma preliminar:**

| Fase | Actividad | Fecha Estimada | Estado |
|------|-----------|----------------|--------|
| 1 | Configuración inicial del hardware ESP32 | Semana 1-2 | ✅ Completado |
| 2 | Desarrollo de API REST y documentación | Semana 2-3 | ✅ Completado |
| 3 | Integración de sensores y recolección de datos | Semana 3-4 | ✅ Completado |
| 4 | Implementación de geolocalización | Semana 4 | ✅ Completado |
| 5 | Dashboard para autoridades de salud pública | Semana 5-6 | ✅ Completado |
| 6 | Modelo predictivo de riesgo vectorial | Semana 6-7 | ✅ Completado |
| 7 | Sistema de alertas automáticas por email | Semana 7 | ✅ Completado |
| 8 | Integración IA Gemini para análisis epidemiológico | Semana 8 | ✅ Completado |
| 9 | Deploy en producción y pruebas finales | Semana 8 | ✅ Completado |
|

**Riesgos identificados y mitigaciones:**

**Riesgo 1:** Problemas de conectividad WiFi desde alcantarillas urbanas  
**Mitigación:** Implementar almacenamiento local temporal y múltiples intentos de transmisión

**Riesgo 2:** Condiciones ambientales extremas que dañen los sensores  
**Mitigación:** Usar carcasas impermeables IP67 y sensores industriales resistentes

**Riesgo 3:** Precisión de sensores de bajo costo para detección de condiciones vectoriales  
**Mitigación:** Calibración con estándares conocidos y validación con estudios entomológicos existentes

**Riesgo 4:** Vandalismo o robo de estaciones de monitoreo  
**Mitigación:** Instalación discreta, anclaje seguro y sistema de monitoreo de conectividad

## 7. Prototipos Conceptuales

**Código mínimo de prueba:**

**ESP32 (Arduino IDE) - Monitoreo de condiciones vectoriales:**
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <MHZ19.h>

// Sensores para detección de hábitats de mosquitos
DHT dht(DHT_PIN, DHT22);
MHZ19 mhz(&mySerial);

void setup() {
  // Configuración de sensores especializados
  dht.begin();
  mhz.begin();
  WiFi.begin(ssid, password);
}

void loop() {
  // Lecturas críticas para mosquitos vectores
  float temp = dht.readTemperature();      // 25-30°C rango óptimo
  float humidity = dht.readHumidity();     // >60% favorable
  int co2 = mhz.getCO2();                 // Indicador de hospedadores
  
  // Envío a sistema de salud pública
  sendToHealthSystem(temp, humidity, co2);
  delay(1800000); // 30 minutos entre lecturas
}
```

**API REST (Node.js) - Sistema de alerta sanitaria:**
```javascript
router.post('/monitoreo-vectorial', (req, res) => {
  const { nodo_id, temperatura, humedad, co2, ubicacion } = req.body;
  
  // Evaluar riesgo de mosquitos vectores
  const riesgoVectorial = evaluarRiesgoMosquitos(temperatura, humedad, co2);
  
  // Alertar autoridades si riesgo alto
  if (riesgoVectorial === 'ALTO') {
    enviarAlertaSaludPublica(nodo_id, ubicacion, {
      temperatura, humedad, co2, riesgo: 'ALTO'
    });
  }
  
  // Almacenar para análisis epidemiológico
  guardarDatosVectoriales(req.body);
});
```

**Evidencia visual:**

-  **API VEMAT:** https://vemat.onrender.com/api-docs/
-  **Prototipo funcionando:** ESP32 monitoreando condiciones ambientales en tiempo real
-  **Base de datos especializada:** MySQL con tablas `nodos` (estaciones) y `lecturas` (datos vectoriales)
-  **Geolocalización de estaciones:** Mapeo automático de ubicaciones de monitoreo
-  **Análisis vectorial:** Correlación de datos ambientales con condiciones propicias para mosquitos
-  **Dashboard epidemiológico(Sitio WEB):** https://vemat-frontend.onrender.com

## Documentación Técnica

**Sistema de Monitoreo Vectorial COMPLETO:**
- **🔗 API Backend:** https://vemat.onrender.com/api-docs/
- **💻 Dashboard Web:** https://vemat-frontend.onrender.com
- **📊 Estado del Sistema:** Operativo 24/7 desde Agosto 2025

### Principales Endpoints API:
- `POST /api/lecturas` - Recibir datos ambientales de estaciones (ESP32/Arduino)
- `POST /api/geo` - Geolocalización de estaciones de monitoreo  
- `GET /api/datosLectura` - Obtener datos para análisis epidemiológico
- `POST /api/consulta` - Análisis IA epidemiológico con Google Gemini
- `GET /api/status` - Estado operacional del sistema
- `GET /api/alertas` - Sistema de alertas automáticas
- `POST /api/prompts` - Gestión de consultas especializadas

### Funcionalidades Implementadas:
- **✅ Monitoreo en Tiempo Real:** ESP32 + 4 sensores especializados
- **✅ Dashboard Interactivo:** Gráficos, mapas y tablas de datos
- **✅ Sistema de Alertas:** Emails automáticos 2x al día
- **✅ IA Epidemiológica:** Asistente con Google Gemini para análisis
- **✅ Base de Datos:** MySQL con 112+ registros ambientales
- **✅ Geolocalización:** Mapas con Leaflet para ubicación de estaciones
- **✅ API REST Completa:** 15+ endpoints documentados con Swagger

### Casos de uso implementados:
- **Prevención de dengue, zika, chikungunya**
- **Monitoreo de alcantarillados urbanos**
- **Alertas tempranas para autoridades sanitarias**
- **Análisis predictivo de brotes vectoriales**
- **Consultas específicas de datos de sensores**
- **Modelos predictivos ambientales**

### Datos Reales del Sistema:
- **📈 Lecturas Registradas:** 112+ registros ambientales
- **🌡️ Rango Temperatura:** 27°C - 36°C
- **💧 Rango Humedad:** 39.3% - 95.6%
- **🌀 Niveles CO₂:** 49 - 1929.7 ppm
- **📍 Ubicación:** Cañas, Guanacaste (10.4308°N, -85.085°W)

---

**Proyecto desarrollado para:** Control de Enfermedades Vectoriales en Entornos Urbanos  
**Colaboración:** Autoridades de Ministerio de Salud  
**Estado Final:** ✅ **COMPLETADO Y EN PRODUCCIÓN**  
**Fecha de Finalización:** Agosto 2025  
**Presentación:** 20 de Agosto de 2025  

**🎯 Sistema 100% funcional y listo para demostración en vivo** 🚀
