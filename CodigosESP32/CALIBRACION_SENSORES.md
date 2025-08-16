# VEMAT - Configuración Mixta: Sensor Real + Potenciómetros

## � **Configuración de Hardware**

### �️ **TEMPERATURA (GPIO34) - SENSOR TMP36 REAL**
- **Tipo**: Sensor analógico real
- **Funcionamiento**: Medición directa de temperatura ambiente
- **Fórmula**: `(voltaje - 0.5) * 100`
- **Rango esperado**: 26-30°C en Cañas, Costa Rica
- **Alertas**: < 26°C o > 30°C

### 🎛️ **POTENCIÓMETROS SIMULADOS**

#### 💧 **HUMEDAD (GPIO39)**
- **Tipo**: Potenciómetro simulando sensor DHT22
- **Control manual**: 0V=45%, 3.3V=85%
- **Alertas**: < 65%

#### 🌬️ **CO2 (GPIO36)**
- **Tipo**: Potenciómetro simulando sensor MQ-135
- **Control manual**: 0V=40ppm, 3.3V=250ppm
- **Alertas**: < 50ppm o > 200ppm

#### 🔊 **SONIDO (GPIO35)**
- **Tipo**: Potenciómetro simulando micrófono
- **Control manual**: 0V=100Hz, 3.3V=2000Hz
- **Rango crítico**: 450-600Hz (Aedes aegypti)
- **Sin alertas automáticas** (análisis por IA)

## 🎛️ **Control por Potenciómetros**

Cada potenciómetro (0-3.3V) mapea a:

```python
# Temperatura: 0V=24°C, 3.3V=32°C
temp = 24 + (voltaje/3.3) * 8

# Humedad: 0V=45%, 3.3V=85%  
humedad = 45 + (voltaje/3.3) * 40

# CO2: 0V=40ppm, 3.3V=250ppm
co2 = 40 + (voltaje/3.3) * 210

# Sonido: 0V=100Hz, 3.3V=2000Hz
sonido = 100 + (voltaje/3.3) * 1900
```

## 🚨 **Validación con Sistema de Alertas**

### ✅ **Temperatura**
- Potenciómetro en 25% → ~26°C → **Sin alerta**
- Potenciómetro en 0% → 24°C → **🚨 ALERTA**
- Potenciómetro en 100% → 32°C → **🚨 ALERTA**

### ✅ **Humedad**
- Potenciómetro en 50% → ~65% → **Sin alerta**
- Potenciómetro en 40% → ~61% → **🚨 ALERTA**

### ✅ **CO2**
- Potenciómetro en 50% → ~145 ppm → **Sin alerta**
- Potenciómetro en 5% → ~50 ppm → **Límite normal**
- Potenciómetro en 95% → ~240 ppm → **🚨 ALERTA**

## 🦟 **Beneficios para Vigilancia Epidemiológica**

1. **Datos coherentes** con condiciones reales de Costa Rica
2. **Alertas funcionales** que disparan en condiciones de riesgo
3. **IA más precisa** con datos en rangos esperados
4. **Análisis acústico** enfocado en frecuencias de mosquitos
5. **Simulación realista** para pruebas del sistema

## 🔧 **Archivos Modificados**
- `CodigosESP32/code.py` - Funciones de mapeo calibradas
- Documentación de rangos y justificaciones técnicas

## 📈 **Próximos Pasos**
1. Cargar código actualizado al ESP32
2. Probar rangos con potenciómetros
3. Validar alertas en frontend
4. Verificar análisis de IA con datos realistas
