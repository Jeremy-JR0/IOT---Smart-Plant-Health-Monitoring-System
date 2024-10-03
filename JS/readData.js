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

function calibrateUltrasonicSensor() {
    fetch('https://lqit46ymn0.execute-api.ap-southeast-2.amazonaws.com/wpc/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'waterPump/control', message: 'CALIBRATE' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => console.log("Calibration command sent"))
    .catch(error => console.error('Error sending calibration command:', error));
}

