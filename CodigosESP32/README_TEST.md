# 🔧 VEMAT Test de Hardware - Instrucciones de Uso

## 📁 **Archivo: `test.py`**

### 🎯 **Propósito**
- Probar el funcionamiento del hardware físico
- Ver valores en tiempo real en la terminal
- Verificar que sensores y potenciómetros funcionen correctamente
- **SIN conexión WiFi ni API** - solo hardware local

### 🔌 **Hardware Requerido**
- **🌡️ Sensor TMP36** conectado a GPIO34
- **🎛️ Potenciómetro CO2** conectado a GPIO36 (VP)
- **🎛️ Potenciómetro Humedad** conectado a GPIO39 (VN)
- **🎛️ Potenciómetro Sonido** conectado a GPIO35

### 🚀 **Cómo Usar**

1. **Cargar el archivo** `test.py` al ESP32
2. **Abrir monitor serie** en Thonny/Arduino IDE
3. **Ejecutar** el programa
4. **Ver lecturas** cada 3 segundos en tiempo real

### 📊 **Qué Muestra**

#### **Cada Lectura:**
```
📊 LECTURA #001:
🌡️ Temperatura:   28.3°C ✅
💧 Humedad:        67.2%  ✅
🌬️ CO2:          125.4 ppm ✅
🔊 Sonido:        523.1 Hz
   Clasificación: 🦟 ⚠️ RANGO AEDES AEGYPTI ⚠️
```

#### **Alertas (si aplica):**
```
🚨 ALERTAS ACTIVAS:
   🚨 HUMEDAD: 62.1%
   🚨 CO2: 245.7 ppm
```

#### **Debug cada 5 lecturas:**
```
🔍 DEBUG:
📊 VOLTAJES RAW:
   🌡️ Temp: 0.783V
   🌬️ CO2: 1.654V
   💧 Humedad: 2.123V
   🔊 Sonido: 1.876V
```

### 🎛️ **Cómo Probar Cada Sensor**

#### **🌡️ Temperatura (TMP36 Real)**
- Se lee automáticamente del ambiente
- **Valores esperados**: 26-30°C en Cañas
- **Alertas si**: < 26°C o > 30°C

#### **🎛️ CO2 (Potenciómetro)**
- **Girar izquierda** → Valores bajos (40 ppm)
- **Girar derecha** → Valores altos (250 ppm)
- **Alertas si**: < 50 ppm o > 200 ppm

#### **🎛️ Humedad (Potenciómetro)**
- **Girar izquierda** → Valores bajos (45%)
- **Girar derecha** → Valores altos (85%)
- **Alerta si**: < 65%

#### **🎛️ Sonido (Potenciómetro)**
- **Girar izquierda** → Frecuencias bajas (100 Hz)
- **Girar derecha** → Frecuencias altas (2000 Hz)
- **Rango crítico**: 450-600 Hz (mosquitos)

### ✅ **Verificaciones de Funcionamiento**

1. **✅ Temperatura cambia** según ambiente real
2. **✅ Potenciómetros responden** al girarlos
3. **✅ Voltajes raw cambian** (0-3.3V)
4. **✅ Alertas aparecen** cuando valores salen de rango
5. **✅ Clasificación de sonido** cambia según frecuencia

### 🛑 **Detener el Test**
- Presionar **Ctrl+C** en la terminal
- Mostrará resumen final de lecturas realizadas

### 🐛 **Solución de Problemas**

#### **Valores No Cambian:**
- Verificar conexiones de potenciómetros
- Revisar pines GPIO correctos
- Comprobar alimentación (3.3V)

#### **Temperatura Incorrecta:**
- Verificar conexión TMP36
- Pin central a GPIO34
- VCC a 3.3V, GND a tierra

#### **Error de Conexión:**
- Es normal, no usa WiFi
- Solo funciona con hardware local

### 📈 **Valores Esperados**

| Sensor | Rango | Normal | Alerta |
|--------|-------|--------|--------|
| 🌡️ Temperatura | 24-32°C | 26-30°C | <26 o >30°C |
| 💧 Humedad | 45-85% | >65% | <65% |
| 🌬️ CO2 | 40-250 ppm | 50-200 ppm | <50 o >200 ppm |
| 🔊 Sonido | 100-2000 Hz | - | Mosquitos: 450-600 Hz |

¡Perfecto para probar el hardware antes de usar con WiFi y API! 🦟📊✨
