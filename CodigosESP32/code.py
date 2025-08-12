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
co2_simulado = analogio.AnalogIn(board.IO36)       # VP / GPIO36
humedad_simulada = analogio.AnalogIn(board.IO39)   # VN / GPIO39
temperatura = analogio.AnalogIn(board.IO34)        # IO34
ruido_simulado = analogio.AnalogIn(board.IO35)     # IO35 - nuevo potenciómetro

def leer_voltaje(pin):
    return (pin.value * 3.3) / 65535

def leer_temperatura(pin):
    voltaje = leer_voltaje(pin)
    temp_c = (voltaje - 0.5) * 100  # fórmula TMP36
    return temp_c

def leer_ruido(pin):
    # Convierte el valor analógico a frecuencia en Hz
    # Escala de 0-65535 a un rango de frecuencias típicas (100-3000 Hz)
    frecuencia_hz = ((pin.value / 65535) * (3000 - 100)) + 100
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
    # Ajusta esta función según tu sensor real
    # Ejemplo: 0V = 400ppm, 3.3V = 2000ppm
    return round(400 + (voltaje / 3.3) * (2000 - 400), 1)

def mapear_voltaje_a_humedad(voltaje):
    # Ajusta esta función según tu sensor real
    # Ejemplo: 0V = 0%, 3.3V = 100%
    return round((voltaje / 3.3) * 100, 1)

def clasificar_sonido(frecuencia_hz):
    """
    Función auxiliar para mostrar en consola la clasificación
    pero NO se envía al servidor
    """
    if frecuencia_hz < 500:
        return "Baja frecuencia"
    elif frecuencia_hz < 2000:
        return "Frecuencia media" 
    else:
        return "Alta frecuencia"

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