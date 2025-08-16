"""
VEMAT - Sistema de Vigilancia Epidemiológica de Mosquitos
Configuración mixta: 1 sensor real + 3 potenciómetros simulados

CONFIGURACIÓN DE HARDWARE:
🌡️ TEMPERATURA (GPIO34): Sensor TMP36 REAL
🎛️ CO2 (GPIO36): Potenciómetro simulado  
🎛️ HUMEDAD (GPIO39): Potenciómetro simulado
🎛️ SONIDO (GPIO35): Potenciómetro simulado

RANGOS DE DATOS CALIBRADOS CON ALERTAS DEL FRONTEND:

🌡️ TEMPERATURA: Sensor TMP36 real
   - Rango esperado: 26-30°C (ambiente Cañas)
   - Alerta si: < 26°C o > 30°C
   - Fórmula: (voltaje - 0.5) * 100

💧 HUMEDAD: 45-85% (potenciómetro)
   - Rango normal: > 65%
   - Alerta si: < 65%
   - Control: 0V=45%, 3.3V=85%

🌬️ CO2: 40-250 ppm (potenciómetro)
   - Rango normal: 50-200 ppm
   - Alerta si: < 50 ppm o > 200 ppm
   - Control: 0V=40ppm, 3.3V=250ppm

🔊 SONIDO: 100-2000 Hz (potenciómetro)
   - Rango crítico: 450-600 Hz (Aedes aegypti)
   - Sin alertas automáticas (análisis IA)
   - Control: 0V=100Hz, 3.3V=2000Hz
"""

import time
import analogio
import board
import wifi
import socketpool
import adafruit_requests
import ssl
import supervisor
import rtc
import json


# Configura el ID de tu nodo
NODO_ID = "node-01"

# Coordenadas fijas de Cañas, Costa Rica
LATITUD_CANAS = 10.43079
LONGITUD_CANAS = -85.08499

# URLs de la API
API_URL = "https://vemat.onrender.com/api/lecturas"
GEO_URL = "https://vemat.onrender.com/api/geo"

# Variable para registrar el nodo solo una vez
nodo_registrado = False

# Inicializar pines
co2_simulado = analogio.AnalogIn(board.IO36)       # 🎛️ POTENCIÓMETRO - VP / GPIO36
humedad_simulada = analogio.AnalogIn(board.IO39)   # 🎛️ POTENCIÓMETRO - VN / GPIO39
temperatura = analogio.AnalogIn(board.IO34)        # 🌡️ SENSOR TMP36 REAL - IO34
ruido_simulado = analogio.AnalogIn(board.IO35)     # 🎛️ POTENCIÓMETRO - IO35

def leer_voltaje(pin):
    return (pin.value * 3.3) / 65535

def leer_temperatura(pin):
    """
    Lee sensor TMP36 REAL (no simulado)
    TMP36: 10 mV/°C, offset 500 mV a 0°C
    Para Cañas, Costa Rica: esperamos ~26-30°C
    """
    voltaje = leer_voltaje(pin)
    # Fórmula TMP36: temp = (voltaje - 0.5) / 0.01
    temp_c = (voltaje - 0.5) * 100  # Sensor TMP36 real
    return round(temp_c, 1)

def leer_ruido(pin):
    """
    Simula frecuencias de sonido relevantes para mosquitos
    Aedes aegypti: ~400-600 Hz (frecuencia de aleteo)
    Ruido ambiental: 100-2000 Hz
    """
    # Convierte el valor analógico a frecuencia en Hz
    # Enfocado en rangos de frecuencia de mosquitos y ambiente urbano
    frecuencia_hz = ((pin.value / 65535) * (2000 - 100)) + 100
    return round(frecuencia_hz, 1)


# Conexión WiFi automática usando settings.toml
while not wifi.radio.ipv4_address:
    print("Esperando conexión WiFi...")
    time.sleep(1)
print("Conectado! IP:", wifi.radio.ipv4_address)


# Inicializar requests con SSL

pool = socketpool.SocketPool(wifi.radio)
ssl_context = ssl.create_default_context()
requests = adafruit_requests.Session(pool, ssl_context)



def mapear_voltaje_a_ppm(voltaje):
    """
    Simula CO2 realista para ambientes exteriores/interiores
    Rango normal: 50-200 ppm (según alertas frontend)
    Con variaciones: 40-250 ppm
    """
    # Mapear 0-3.3V a rango realista de CO2
    # CO2 exterior normal: ~400ppm, pero para alertas usamos 50-200ppm
    co2_ppm = 40 + (voltaje / 3.3) * 210  # Rango 40-250 ppm
    return round(co2_ppm, 1)

def mapear_voltaje_a_humedad(voltaje):
    """
    Simula humedad realista para clima tropical seco
    Rango normal: >65% (según alertas frontend)
    Variaciones: 45-85% (época seca vs lluviosa)
    """
    # Mapear 0-3.3V a rango realista de humedad tropical
    # Base: 65% (umbral de alerta) con variaciones ±20%
    humedad_pct = 45 + (voltaje / 3.3) * 40  # Rango 45-85%
    return round(humedad_pct, 1)

def clasificar_sonido(frecuencia_hz):
    """
    Clasificación de sonido relevante para vigilancia de mosquitos
    Aedes aegypti hembra: ~400-600 Hz
    Ruido urbano bajo: <300 Hz
    Posible actividad vectorial: 400-600 Hz
    Ruido ambiental alto: >800 Hz
    """
    if frecuencia_hz < 300:
        return "Ruido ambiental bajo"
    elif 300 <= frecuencia_hz < 450:
        return "Transición - posible actividad"
    elif 450 <= frecuencia_hz <= 600:
        return "⚠️ RANGO AEDES AEGYPTI ⚠️"
    elif 600 < frecuencia_hz < 1000:
        return "Ruido urbano moderado"
    else:
        return "Ruido ambiental alto"

while True:
    # 1. REGISTRAR NODO (solo la primera vez)
    if not nodo_registrado:
        geo_data = {
            "nodo_id": NODO_ID,
            "latitud": LATITUD_CANAS,
            "longitud": LONGITUD_CANAS
        }
        print("🌍 Registrando ubicación del nodo:", geo_data)
        try:
            geo_response = requests.post(GEO_URL, json=geo_data)
            print("✅ Nodo registrado:", geo_response.status_code, geo_response.text)
            nodo_registrado = True
        except Exception as geo_error:
            print("❌ Error registrando nodo:", geo_error)
            print("⏳ Reintentando en 10 segundos...")
            time.sleep(10)
            continue
    
    # 2. LEER SENSORES
    v_co2 = leer_voltaje(co2_simulado)
    v_humedad = leer_voltaje(humedad_simulada)
    temp = leer_temperatura(temperatura)
    sonido_hz = leer_ruido(ruido_simulado)  # Ahora retorna Hz

    co2_ppm = mapear_voltaje_a_ppm(v_co2)
    humedad_pct = mapear_voltaje_a_humedad(v_humedad)
    
    # Solo para mostrar en consola la clasificación
    clasificacion_sonido = clasificar_sonido(sonido_hz)

    # Obtener timestamp compatible con MySQL (YYYY-MM-DD HH:MM:SS)
    try:
        fecha = rtc.RTC().datetime
        timestamp = "{:04d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}".format(
            fecha.tm_year, fecha.tm_mon, fecha.tm_mday,
            fecha.tm_hour, fecha.tm_min, fecha.tm_sec)
    except Exception:
        timestamp = None

    # 3. ENVIAR LECTURA
    data = {
        "nodo_id": NODO_ID,
        "temperatura": round(temp, 2),
        "humedad": humedad_pct,
        "co2": co2_ppm,
        "sonido": sonido_hz,  # Enviar el número en Hz
        "timestamp": timestamp
    }

    print("📊 Enviando lectura:", data)
    print("📊 Sonido: {:.1f} Hz ({})".format(sonido_hz, clasificacion_sonido))
    try:
        response = requests.post(API_URL, json=data)
        print("✅ Lectura enviada:", response.status_code, response.text)
    except Exception as e:
        print("❌ Error enviando lectura:", e)

    print("––––––––––––––––––––––––––")
    time.sleep(60)