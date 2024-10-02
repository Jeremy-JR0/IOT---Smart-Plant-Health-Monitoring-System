from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import RPi.GPIO as GPIO
import time
import threading

# GPIO setup
WATER_PUMP_PIN = 17  # GPIO pin for water pump relay
GPIO.setmode(GPIO.BCM)
GPIO.setup(WATER_PUMP_PIN, GPIO.OUT)

# Global variables to manage modes and threads
automatic_mode = False
automatic_thread = None
stop_event = threading.Event()

# Automatic control function
def automatic_control(stop_event):
    try:
        while not stop_event.is_set():
            # Turn on the water pump
            GPIO.output(WATER_PUMP_PIN, GPIO.HIGH)
            print("Water pump turned ON (automatic mode)")
            time.sleep(10)  # Pump is on for 10 seconds (adjust as needed)

            # Turn off the water pump
            GPIO.output(WATER_PUMP_PIN, GPIO.LOW)
            print("Water pump turned OFF (automatic mode)")

            # Wait for the next interval or until stop_event is set
            interval = 3600  # Wait for 1 hour (adjust as needed)
            for _ in range(interval):
                if stop_event.is_set():
                    break
                time.sleep(1)
    except Exception as e:
        print(f"Error in automatic_control thread: {e}")
    finally:
        GPIO.output(WATER_PUMP_PIN, GPIO.LOW)  # Ensure pump is turned off
        print("Automatic control thread exiting.")

# Custom MQTT message callback
def customCallback(client, userdata, message):
    global automatic_mode, automatic_thread, stop_event

    payload = message.payload.decode()
    print(f"Received message '{payload}' on topic '{message.topic}'")

    if payload == "ON":
        if not automatic_mode:
            GPIO.output(WATER_PUMP_PIN, GPIO.HIGH)  # Turn on water pump
            print("Water pump turned ON (manual mode)")
        else:
            print("Ignored manual command 'ON' while in automatic mode")
    elif payload == "OFF":
        if not automatic_mode:
            GPIO.output(WATER_PUMP_PIN, GPIO.LOW)  # Turn off water pump
            print("Water pump turned OFF (manual mode)")
        else:
            print("Ignored manual command 'OFF' while in automatic mode")
    elif payload == "automatic":
        if not automatic_mode:
            automatic_mode = True
            stop_event.clear()
            automatic_thread = threading.Thread(target=automatic_control, args=(stop_event,))
            automatic_thread.start()
            print("Automatic mode activated")
        else:
            print("Automatic mode is already active")
    elif payload == "manual":
        if automatic_mode:
            automatic_mode = False
            stop_event.set()
            automatic_thread.join()
            GPIO.output(WATER_PUMP_PIN, GPIO.LOW)  # Ensure pump is turned off
            print("Switched to manual mode")
        else:
            print("Already in manual mode")
    else:
        print(f"Unknown command received: {payload}")

# Initialize AWS IoT MQTT Client
mqtt_client = AWSIoTMQTTClient("PlantWaterControl")
mqtt_client.configureEndpoint("YOUR_AWS_IOT_ENDPOINT", 8883)  # Replace with your AWS IoT endpoint
mqtt_client.configureCredentials("/home/pi/certs/AmazonRootCA1.pem",  # Root CA certificate
                                 "/home/pi/certs/private.pem.key",    # Private key
                                 "/home/pi/certs/certificate.pem.crt")  # Device certificate

# Configure the MQTT client connection parameters
mqtt_client.configureOfflinePublishQueueing(-1)  # Infinite offline publish queueing
mqtt_client.configureDrainingFrequency(2)        # Draining: 2 Hz
mqtt_client.configureConnectDisconnectTimeout(10)  # 10 sec
mqtt_client.configureMQTTOperationTimeout(5)       # 5 sec

# Connect to AWS IoT
mqtt_client.connect()

# Subscribe to the water pump control topic
mqtt_client.subscribe("waterPump/control", 1, customCallback)

try:
    # Keep the program running and listening for messages
    while True:
        time.sleep(1)  # Maintain connection and keep listening for messages
except KeyboardInterrupt:
    # Cleanup on exit
    print("Exiting...")
    if automatic_mode:
        stop_event.set()
        automatic_thread.join()
    GPIO.cleanup()
    mqtt_client.disconnect()
