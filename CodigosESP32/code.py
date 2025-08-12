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
NODO_ID = "node-07"

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
    # Escala el valor analógico a porcentaje (0-100%)
    nivel = (pin.value / 65535) * 100
    return round(nivel, 2)


# Conexión WiFi automática usando settings.toml
while not wifi.radio.ipv4_address:
    print("Esperando conexión WiFi...")
    time.sleep(1)
print("Conectado! IP:", wifi.radio.ipv4_address)


# Inicializar requests con SSL

pool = socketpool.SocketPool(wifi.radio)
ssl_context = ssl.create_default_context()
requests = adafruit_requests.Session(pool, ssl_context)

API_URL = "https://vemat.onrender.com/api/lecturas"



def mapear_voltaje_a_ppm(voltaje):
    # Ajusta esta función según tu sensor real
    # Ejemplo: 0V = 400ppm, 3.3V = 2000ppm
    return round(400 + (voltaje / 3.3) * (2000 - 400), 1)

def mapear_voltaje_a_humedad(voltaje):
    # Ajusta esta función según tu sensor real
    # Ejemplo: 0V = 0%, 3.3V = 100%
    return round((voltaje / 3.3) * 100, 1)

def clasificar_sonido(valor):
    # Puedes ajustar el umbral según tu aplicación
    if valor < 30:
        return "bajo"
    elif valor < 70:
        return "normal"
    else:
        return "alto"

while True:
    v_co2 = leer_voltaje(co2_simulado)
    v_humedad = leer_voltaje(humedad_simulada)
    temp = leer_temperatura(temperatura)
    ruido = leer_ruido(ruido_simulado)

    co2_ppm = mapear_voltaje_a_ppm(v_co2)
    humedad_pct = mapear_voltaje_a_humedad(v_humedad)
    sonido_str = clasificar_sonido(ruido)

    # Obtener timestamp compatible con MySQL (YYYY-MM-DD HH:MM:SS)
    try:
        fecha = rtc.RTC().datetime
        timestamp = "{:04d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}".format(
            fecha.tm_year, fecha.tm_mon, fecha.tm_mday,
            fecha.tm_hour, fecha.tm_min, fecha.tm_sec)
    except Exception:
        timestamp = None

    data = {
        "nodo_id": NODO_ID,
        "temperatura": round(temp, 2),
        "humedad": humedad_pct,
        "co2": co2_ppm,
        "sonido": sonido_str,
        "timestamp": timestamp
    }

    print("Enviando datos:", data)
    try:
        response = requests.post(API_URL, json=data)
        print("Respuesta:", response.status_code, response.text)
    except Exception as e:
        print("Error al enviar:", e)

    print("––––––––––––––––––––––––––")
    time.sleep(60)