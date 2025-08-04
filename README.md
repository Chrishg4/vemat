# VEMAT - Vigilancia Ecológica de Mosquitos con Asistencia Tecnológica

## 1. Información del Proyecto

**Nombre del Proyecto:** VEMAT (Vigilancia Ecológica de Mosquitos con Asistencia Tecnológica)

**Título Completo:** "MONITORIZACIÓN AMBIENTAL INTELIGENTE PARA LA PREVENCIÓN DE ENFERMEDADES VECTORIALES: DETECCIÓN DE HÁBITATS DE MOSQUITOS EN ALCANTARILLADOS URBANOS UTILIZANDO ARDUINO Y SENSORES"

**Equipo:** 
- [Nombres de los integrantes del equipo]

**Roles:**
- [Christofer]: Desarrollo de Hardware y Sensores (ESP32/Arduino)
- [Christofer y Jose Pablo]: Desarrollo Backend y API (Node.js)
- [Jefferson y Jose Pablo]: Análisis de Datos y Modelos Predictivos
- [Brad y Jefferson]: Frontend y Dashboard de Monitoreo

## 2. Descripción y Justificación

**Problema que se aborda:**
Las enfermedades transmitidas por mosquitos (dengue, zika, chikungunya, etc.) representan un problema de salud pública significativo en entornos urbanos. Los sistemas de alcantarillado, tanto pluvial como sanitario, son conocidos por ser refugios ideales para la reproducción y supervivencia de estos vectores debido a sus condiciones ambientales específicas. La falta de información en tiempo real sobre estas condiciones dificulta la implementación de estrategias de control y prevención efectivas.

**Importancia y contexto:**
Los mosquitos transmisores de enfermedades encuentran en los alcantarillados urbanos las condiciones perfectas para su proliferación: alta humedad, temperaturas estables, materia orgánica y refugio. El monitoreo continuo de estas condiciones ambientales permite predecir y prevenir brotes de enfermedades vectoriales, protegiendo la salud pública.

**Usuarios/beneficiarios:**
- Autoridades de salud pública
- Gobiernos locales y municipales
- Comunidades urbanas en riesgo
- Investigadores en epidemiología y control vectorial
- Organizaciones de prevención sanitaria

## 3. Objetivos del Proyecto

**Objetivo General:**
Desarrollar un sistema de monitoreo ambiental basado en tecnología Arduino y sensores para identificar y predecir condiciones ambientales propicias para la proliferación de mosquitos transmisores de enfermedades en alcantarillados urbanos, con el fin de mejorar las estrategias de prevención y control.

**Objetivos Específicos:**
1. Diseñar e implementar estaciones de monitoreo autónomas utilizando ESP32/Arduino para la recolección de datos ambientales clave (temperatura, humedad relativa, dióxido de carbono y gases relevantes) en salidas de alcantarillas urbanas
2. Desarrollar una API REST para recepción, almacenamiento y gestión de datos de sensores ambientales
3. Crear una base de datos para almacenar y gestionar la información ambiental recolectada
4. Desarrollar un modelo de predicción que correlacione las variables ambientales con la probabilidad de presencia y proliferación de mosquitos vectores
5. Generar visualizaciones y reportes de las condiciones ambientales y las predicciones de riesgo para facilitar la toma de decisiones por parte de las autoridades de salud
6. Evaluar la viabilidad y efectividad del sistema en un entorno urbano real

## 4. Requisitos Iniciales

Lista de lo que el sistema debe lograr:

**Requisito 1:** El sistema debe monitorear temperatura, humedad relativa, CO2 y gases volátiles en tiempo real en estaciones ubicadas en salidas de alcantarillas urbanas
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

**Librerías y herramientas:**
- **Backend:** Express, MySQL2, Swagger, Axios
- **Hardware:** Arduino IDE, bibliotecas de sensores especializados
- **Análisis:** Python con Pandas, NumPy, Scikit-learn para modelos predictivos
- **Base de datos:** MySQL en Aiven Cloud
- **Deployment:** Render.com para alta disponibilidad

## 6. Plan de Trabajo

**Cronograma preliminar:**

| Fase | Actividad | Fecha Estimada | Estado |
|------|-----------|----------------|--------|
| 1 | Configuración inicial del hardware ESP32 | Semana 1-2 | ✅ Completado |
| 2 | Desarrollo de API REST y documentación | Semana 2-3 | ✅ Completado |
| 3 | Integración de sensores y recolección de datos | Semana 3-4 | ✅ Completado |
| 4 | Implementación de geolocalización | Semana 4 | ✅ Completado |
| 5 | Dashboard para autoridades de salud pública | Semana 5-6 | 🔄 En progreso |
| 6 | Modelo predictivo de riesgo vectorial | Semana 6-7 | 📋 Planeado |
| 7 | Instalación piloto en alcantarillas urbanas | Semana 7-8 | 📋 Planeado |
| 8 | Validación con datos entomológicos | Semana 8-9 | 📋 Planeado |

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

-  **API Sistema de Salud:** https://vemat.onrender.com/api-docs/
-  **Prototipo funcionando:** ESP32 monitoreando condiciones ambientales en tiempo real
-  **Base de datos especializada:** MySQL con tablas `nodos` (estaciones) y `lecturas` (datos vectoriales)
-  **Geolocalización de estaciones:** Mapeo automático de ubicaciones de monitoreo
-  **Análisis vectorial:** Correlación de datos ambientales con condiciones propicias para mosquitos
-  **Dashboard epidemiológico:** En desarrollo para autoridades de salud

## Documentación Técnica

**Sistema de Monitoreo Vectorial:**
**URL:** https://vemat.onrender.com/api-docs/

### Endpoints especializados:
- `POST /api/lecturas` - Recibir datos ambientales de estaciones (ESP32/Arduino)
- `POST /api/geo` - Geolocalización de estaciones de monitoreo  
- `GET /api/datosLectura` - Obtener datos para análisis epidemiológico

### Casos de uso específicos:
- **Prevención de dengue, zika, chikungunya**
- **Monitoreo de alcantarillados urbanos**
- **Alertas tempranas para autoridades sanitarias**
- **Análisis predictivo de brotes vectoriales**

---

**Proyecto desarrollado para:** Control de Enfermedades Vectoriales en Entornos Urbanos  
**Colaboración:** Autoridades de Ministerio de Salud  
**Fecha:** Agosto 2025
