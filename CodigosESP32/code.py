import time
import analogio
import board

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

while True:
    v_co2 = leer_voltaje(co2_simulado)
    v_humedad = leer_voltaje(humedad_simulada)
    temp = leer_temperatura(temperatura)
    ruido = leer_ruido(ruido_simulado)

    print("CO₂ (simulado): {:.2f} V".format(v_co2))
    print("Humedad (simulada): {:.2f} V".format(v_humedad))
    print("Temperatura (TMP36): {:.2f} °C".format(temp))
    print("Ruido (simulado): {:.2f} %".format(ruido))  # agregado
    print("––––––––––––––––––––––––––")
    time.sleep(3)