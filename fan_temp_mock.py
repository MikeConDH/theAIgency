import time
from gpiozero import OutputDevice

# Replace this with actual GPIO pin you're using for MOSFET Gate
FAN_PIN = 17
fan = OutputDevice(FAN_PIN)

# Path to your temp sensor data
TEMP_SENSOR_PATH = "/sys/bus/w1/devices/28-*/w1_slave"

# Mock users and preferences
mock_users = {
    'user_1': {'threshold': 19.0},
    'user_2': {'threshold': 19.0},
}

def read_temp():
    try:
        import glob
        sensor_file = glob.glob(TEMP_SENSOR_PATH)[0]
        with open(sensor_file) as f:
            lines = f.readlines()
        if "YES" in lines[0]:
            temp_str = lines[1].split("t=")[-1]
            return float(temp_str) / 1000.0
    except Exception as e:
        print("Temp read error:", e)
        return None

def main():
    print("Mocking NFC tap... use 'user_1' by default.")
    user = 'user_1'
    prefs = mock_users.get(user, {'threshold': 24.0})

    while True:
        temp = read_temp()
        if temp is None:
            print("No temp data")
            time.sleep(2)
            continue

        print(f"Temp: {temp:.2f}°C | Threshold: {prefs['threshold']}°C")
        if temp > prefs['threshold']:
            print("Fan ON")
            fan.on()
        else:
            print("Fan OFF")
            fan.off()
        time.sleep(3)

if __name__ == "__main__":
    main()