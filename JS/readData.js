// API Gateway URL
const apiUrl = 'https://9wohjilbw6.execute-api.ap-southeast-2.amazonaws.com/data/RetrieveSensorData';

// Function to fetch and update the latest sensor value
function fetchLatestValue() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Extract the latest value from the array (assuming the latest is the last item)
            const latestData = data[data.length - 1];
            const temperature = latestData.payload.temperature;
            const humidity = latestData.payload.humidity;
            const lightLevel = latestData.payload.light_level;
            const phLevel = latestData.payload.ph_level;
            const soilMoisture = latestData.payload.soil_moisture;

            // Display the values
            document.getElementById('value-display').textContent = 
                `Temperature: ${temperature} °C, ` +
                `Humidity: ${humidity} %, ` +
                `Light Level: ${lightLevel} lx, ` +
                `pH Level: ${phLevel}, ` +
                `Soil Moisture: ${soilMoisture}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('value-display').textContent = `Error fetching data: ${error.message}`;
        });
}

// Fetch the latest value initially
fetchLatestValue();

// Set an interval to update the value periodically (e.g., every 5 seconds)
setInterval(fetchLatestValue, 5000);

function toggleWaterPump(action) {
    fetch('https://lqit46ymn0.execute-api.ap-southeast-2.amazonaws.com/wpc/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'waterPump/control', message: action })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => console.log("Water pump control: ", action))
    .catch(error => console.error('Error controlling water pump:', error));
}

function toggleRGBLight(action) {
    fetch('https://lqit46ymn0.execute-api.ap-southeast-2.amazonaws.com/rgb/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'rgbLight/control', message: action })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => console.log("RGB light control: ", action))
    .catch(error => console.error('Error controlling RGB light:', error));
}

function toggleAutomaticMode(checkbox) {
    const action = checkbox.checked ? 'automatic' : 'manual';
    
    // Disable or enable the manual control buttons
    document.getElementById('water-on-btn').disabled = checkbox.checked;
    document.getElementById('water-off-btn').disabled = checkbox.checked;

    fetch('https://lqit46ymn0.execute-api.ap-southeast-2.amazonaws.com/wpc/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'waterPump/control', message: action })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => console.log("Water pump mode: ", action))
    .catch(error => console.error('Error toggling automatic mode:', error));
}


function toggleRGBLight(action) {
    fetch('https://u70oktpbs1.execute-api.ap-southeast-2.amazonaws.com/rgbled/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'rgbLED/control', message: action })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => console.log("RGB light control: ", action))
    .catch(error => console.error('Error controlling RGB light:', error));
}


// //==============================================================================================================================================
// let autoWaterEnabled = false;
// let autoLEDEnabled = false;

// // Function to toggle manual water pump control
// function toggleWaterPump() {
//     fetch('YOUR_AWS_API_GATEWAY_ENDPOINT', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ topic: 'waterPump/control', message: 'ON' })
//     }).then(response => response.json())
//       .then(data => console.log("Watering plant manually"));
// }

// // Function to toggle automatic watering control
// function toggleAutoWatering(enabled) {
//     autoWaterEnabled = enabled;
//     if (enabled) {
//         console.log("Automatic watering enabled");
//     } else {
//         console.log("Automatic watering disabled");
//     }
// }

// // Function to toggle manual RGB LED control
// function toggleLED() {
//     fetch('YOUR_AWS_API_GATEWAY_ENDPOINT', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ topic: 'plantLight/control', message: JSON.stringify({ color: 'blue', brightness: 100 }) })
//     }).then(response => response.json())
//       .then(data => console.log("RGB LED manually turned on"));
// }

// // Function to toggle automatic LED control
// function toggleAutoLED(enabled) {
//     autoLEDEnabled = enabled;
//     if (enabled) {
//         console.log("Automatic LED control enabled");
//     } else {
//         console.log("Automatic LED control disabled");
//     }
// }

// // Function to get sensor data from AWS IoT Core and decide on automatic actions
// function getSensorData() {
//     fetch('YOUR_API_ENDPOINT')
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById('soil-moisture-value').innerText = data.soilMoisture;

//             // Automatic watering logic
//             if (autoWaterEnabled && data.soilMoisture < 400) {  // Replace 400 with your threshold
//                 console.log("Automatically watering plant based on moisture level");

//                 // Send a POST request to water the plant automatically
//                 fetch('YOUR_AWS_API_GATEWAY_ENDPOINT', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ topic: 'waterPump/control', message: 'ON' })
//                 }).then(response => response.json())
//                   .then(data => console.log("Automatic watering triggered"));
//             }

//             // Automatic LED control logic
//             if (autoLEDEnabled && data.lightLevel < 200) {  // Replace 200 with your light level threshold
//                 console.log("Automatically turning on RGB LED based on light level");

//                 // Send a POST request to turn on the LED automatically
//                 fetch('YOUR_AWS_API_GATEWAY_ENDPOINT', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ topic: 'plantLight/control', message: JSON.stringify({ color: 'blue', brightness: 100 }) })
//                 }).then(response => response.json())
//                   .then(data => console.log("Automatic LED control triggered"));
//             }
//         });
// }

// // Poll for sensor data every 10 seconds
// setInterval(getSensorData, 10000);
// //==============================================================================================================================================