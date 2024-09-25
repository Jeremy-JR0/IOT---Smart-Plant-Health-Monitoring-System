from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import RPi.GPIO as GPIO
import time

# GPIO setup
WATER_PUMP_PIN = 17  # GPIO pin for water pump relay
GPIO.setmode(GPIO.BCM)
GPIO.setup(WATER_PUMP_PIN, GPIO.OUT)

# Custom MQTT message callback
def customCallback(client, userdata, message):
    payload = message.payload.decode()
    print(f"Received message '{payload}' on topic '{message.topic}'")
    
    if payload == "ON":
        GPIO.output(WATER_PUMP_PIN, GPIO.HIGH)  # Turn on water pump
        print("Water pump turned ON")
    elif payload == "OFF":
        GPIO.output(WATER_PUMP_PIN, GPIO.LOW)  # Turn off water pump
        print("Water pump turned OFF")

# Initialize AWS IoT MQTT Client
mqtt_client = AWSIoTMQTTClient("PlantWaterControl")
mqtt_client.configureEndpoint("YOUR_AWS_IOT_ENDPOINT", 8883)  # Replace with your AWS IoT endpoint
mqtt_client.configureCredentials("/home/pi/certs/AmazonRootCA1.pem",  # Root CA certificate
                            "/home/pi/certs/private.pem.key",  # Private key
                            "/home/pi/certs/certificate.pem.crt")  # Device certificate

# Configure the MQTT client connection parameters
mqtt_client.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
mqtt_client.configureDrainingFrequency(2)  # Draining: 2 Hz
mqtt_client.configureConnectDisconnectTimeout(10)  # 10 sec
mqtt_client.configureMQTTOperationTimeout(5)  # 5 sec

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
    GPIO.cleanup()
    mqtt_client.disconnect()
