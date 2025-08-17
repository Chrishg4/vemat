import board
import analogio
import neopixel
import time

# Configuración de sensores
temp_sensor = analogio.AnalogIn(board.IO34)    # Sensor TMP36 real (GPIO34)
co2_sim = analogio.AnalogIn(board.IO36)        # Potenciómetro para CO2 (GPIO36)
humidity_sim = analogio.AnalogIn(board.IO39)   # Potenciómetro para humedad (GPIO39)
sound_sim = analogio.AnalogIn(board.IO35)      # Potenciómetro para sonido (GPIO35)

# Configuración NeoPixel - WS2812B en GPIO2
pixel = neopixel.NeoPixel(board.IO2, 1, brightness=0.3, auto_write=True)

def led_verde():
    """Encender LED verde (lectura exitosa)"""
    pixel[0] = (0, 255, 0)

def led_azul():
    """Encender LED azul (inicio)"""
    pixel[0] = (0, 0, 255)

def led_rojo():
    """Encender LED rojo (error)"""
    pixel[0] = (255, 0, 0)

def led_off():
    """Apagar LED"""
    pixel[0] = (0, 0, 0)

def parpadeo_lectura():
    """Parpadeo verde para indicar nueva lectura"""
    for i in range(3):
        led_verde()
        time.sleep(0.15)
        led_off()
        time.sleep(0.15)

def read_voltage(analog_pin):
    """Convertir lectura analógica a voltaje"""
    return (analog_pin.value * 3.3) / 65536

def read_temperature():
    """Leer temperatura del sensor TMP36"""
    voltage = read_voltage(temp_sensor)
    # TMP36: 0.5V = 0°C, 10mV/°C
    temp_c = (voltage - 0.5) * 100
    return temp_c

def read_co2_simulation():
    """Simular lectura de CO2 con potenciómetro"""
    voltage = read_voltage(co2_sim)
    # Mapear 0-3.3V a 300-1200 ppm
    co2_ppm = 300 + (voltage / 3.3) * 900
    return co2_ppm

def read_humidity_simulation():
    """Simular lectura de humedad con potenciómetro"""
    voltage = read_voltage(humidity_sim)
    # Mapear 0-3.3V a 30-95%
    humidity = 30 + (voltage / 3.3) * 65
    return humidity

def read_sound_simulation():
    """Simular lectura de sonido con potenciómetro"""
    voltage = read_voltage(sound_sim)
    # Mapear 0-3.3V a 0-100 dB
    sound_db = (voltage / 3.3) * 100
    return sound_db

print("=== VEMAT ESP32 - Lectura de Sensores con NeoPixel ===")
print("LED RGB (GPIO2): Verde en cada lectura")
print("\nSensores configurados:")
print("IO34 (GPIO34): TMP36 (Temperatura)")
print("IO36 (GPIO36): Potenciómetro (CO2)")  
print("IO39 (GPIO39): Potenciómetro (Humedad)")
print("IO35 (GPIO35): Potenciómetro (Sonido)")
print("\nPresiona Ctrl+C para detener\n")

# Indicar inicio con LED azul
print("🔵 Iniciando... (LED azul)")
led_azul()
time.sleep(1)
led_off()

try:
    while True:
        # Leer todos los sensores
        temperatura = read_temperature()
        co2 = read_co2_simulation()
        humedad = read_humidity_simulation()
        sonido = read_sound_simulation()
        
        # Leer voltajes directos
        volt_temp = read_voltage(temp_sensor)
        volt_co2 = read_voltage(co2_sim)
        volt_humedad = read_voltage(humidity_sim)
        volt_sonido = read_voltage(sound_sim)
        
        # Imprimir valores
        print(f"Temperatura: {temperatura:.1f}°C (Voltaje: {volt_temp:.3f}V)")
        print(f"CO2: {co2:.0f} ppm (Voltaje: {volt_co2:.3f}V)")
        print(f"Humedad: {humedad:.1f}% (Voltaje: {volt_humedad:.3f}V)")
        print(f"Sonido: {sonido:.1f} dB (Voltaje: {volt_sonido:.3f}V)")
        print("-" * 40)
        
        # Parpadeo verde para indicar lectura exitosa
        parpadeo_lectura()
        
        time.sleep(1.1)  # Resto del tiempo para completar 2 segundos
        
except KeyboardInterrupt:
    print("\n🟢 Prueba terminada")
    led_off()  # Apagar LED al terminar
