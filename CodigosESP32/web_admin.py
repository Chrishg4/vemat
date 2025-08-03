import wifi
import ipaddress


if wifi.radio.ipv4_address:
    print("ip asig:", wifi.radio.ipv4_address)
else:
    print("no se ha podido conectar a internet")
        
