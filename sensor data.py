import Adafruit_DHT
import time
import requests

TH_SENSOR = Adafruit_DHT.DHT22 # Need to check this
PIN = 4

USER_ID = b

API_ENDPOINT = a

def read_Temp_Humidity():
    # Read temperature and humidity from sensor
    humidity, temperature = Adafruit_DHT.read_retry(TH_SENSOR, PIN)

    #If data exists it will return the data, if it doesnt exist it will return None
    if humidity is not None and temperature is not None:
        return {"Temperature": temperature, "Humidity": humidity}
    else:
        print("Failed to retrieve data from the sensor.")
        return {"Temperature": None, "Humidity": None}
    
while True:

    # Collects data buy calling read_Temp_Humidity function
    sensor_data = read_Temp_Humidity()

    # Checks if data being sent exists and is valid
    if sensor_data["Temperature"] is not None and sensor_data["Humidity"] is not None:
        data = {
            "user_id" : USER_ID,
            **sensor_data,
            "Timestamp" : time.time()
        }

        # Attempt to send data to AWS Cloud server
        try:
            response = requests.post(API_ENDPOINT, json = data)
            print(f"Data sent: {data}, Response: {response.status_code}")
        
        except Exception as e:
            print(f"Failed to send data {e}")
    else:
        print("No valid data to send")
    
    time.sleep(10) # Time interval between each check for data