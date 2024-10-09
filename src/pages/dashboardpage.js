import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import '../dashboardpage.css';

const sensorDataApiUrl = 'https://9wohjilbw6.execute-api.ap-southeast-2.amazonaws.com/data/RetrieveSensorData';
const waterPumpControlUrl = 'https://lqit46ymn0.execute-api.ap-southeast-2.amazonaws.com/wpc/control';
const rgbLightControlUrl = 'https://u70oktpbs1.execute-api.ap-southeast-2.amazonaws.com/rgbled/control';

function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [recommendedData, setRecommendedData] = useState(null);
  const [waterLevel, setWaterLevel] = useState(0); 
  const [automaticMode, setAutomaticMode] = useState(false);
  const [automaticLightMode, setAutomaticLightMode] = useState(false);

  const fetchLatestValue = async () => {
    try {
      const sensorResponse = await fetch(sensorDataApiUrl);
      if (!sensorResponse.ok) throw new Error(`Sensor Data Error: ${sensorResponse.statusText}`);
      const sensorDataArray = await sensorResponse.json();
      const latestSensorData = sensorDataArray[sensorDataArray.length - 1].payload;
      setSensorData(latestSensorData);
      setWaterLevel(latestSensorData.water_level || 0);

      const recommendedResponse = await fetch(sensorDataApiUrl);
      if (!recommendedResponse.ok) throw new Error(`Recommended Data Error: ${recommendedResponse.statusText}`);
      const recommendedDataArray = await recommendedResponse.json();
      const latestRecommendedData = recommendedDataArray[recommendedDataArray.length - 1];
      setRecommendedData(latestRecommendedData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchLatestValue();
    const intervalId = setInterval(fetchLatestValue, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const toggleWaterPump = (action) => {
    fetch(waterPumpControlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'waterPump/control', message: action }),
    }).catch(error => console.error('Error controlling water pump:', error));
  };

  const toggleRGBLight = (action) => {
    fetch(rgbLightControlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'rgbLED/control', message: action }),
    }).catch(error => console.error('Error controlling RGB light:', error));
  };

  const toggleAutomaticMode = (event) => {
    const isChecked = event.target.checked;
    setAutomaticMode(isChecked);
    const action = isChecked ? 'automatic' : 'manual';
    fetch(waterPumpControlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'waterPump/control', message: action }),
    }).catch(error => console.error('Error toggling automatic mode:', error));
  };

  const toggleAutomaticLightMode = (event) => {
    const isChecked = event.target.checked;
    setAutomaticLightMode(isChecked);
    const action = isChecked ? 'automatic' : 'manual';
    fetch(rgbLightControlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'rgbLED/control', message: action }),
    }).catch(error => console.error('Error toggling RGB light mode:', error));
  };

  const calibrateUltrasonicSensor = () => {
    fetch(waterPumpControlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'waterPump/control', message: 'CALIBRATE' }),
    }).catch(error => console.error('Error sending calibration command:', error));
  };

  const pieData = [{ name: 'Water Level', value: waterLevel || 0 }];
  const COLORS = [waterLevel < 53 ? '#ff4d4f' : '#008036'];

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <div className="data-card">
          <h3>Air</h3>
          <div className="data-content">
            <div className="sensor-data">
              <h4>Live data</h4>
              <p>Temperature: {sensorData ? sensorData.temperature : 'Loading...'} °C</p>
              <p>Humidity: {sensorData ? sensorData.humidity : 'Loading...'} %</p>
              <p>Light: {sensorData ? sensorData.light_level : 'Loading...'} Lux</p>
            </div>
            <div className="recommended-data">
              <h4>Recommended data</h4>
              <p>Temperature: {recommendedData ? recommendedData.rec_tem : 'Loading...'} °C</p>
              <p>Humidity: {recommendedData ? recommendedData.rec_humidity : 'Loading...'} %</p>
              <p>Light: {recommendedData ? recommendedData.rec_light : 'Loading...'} Lux</p>
            </div>
          </div>
        </div>

        <div className="data-card">
          <h3>Soil</h3>
          <div className="data-content">
            <div className="sensor-data">
              <h4>Live data</h4>
              <p>Temperature: {sensorData ? sensorData.soil_temp : 'Loading...'} °C</p>
              <p>Humidity: {sensorData ? sensorData.soil_humidity : 'Loading...'} %</p>
              <p>PH: {sensorData ? sensorData.soil_ph : 'Loading...'}</p>
              <p>Conductivity: {sensorData ? sensorData.soil_conductivity : 'Loading...'} μs/cm</p>
              <p>Nitrogen: {sensorData ? sensorData.soil_n : 'Loading...'} Mg/kg</p>
              <p>Phosphorus: {sensorData ? sensorData.soi_phosphorus : 'Loading...'} Mg/kg</p>
              <p>Potassium: {sensorData ? sensorData.soil_potassium : 'Loading...'} Mg/kg</p>
            </div>
            <div className="recommended-data">
              <h4>Recommended data</h4>
              <p>Temperature: {recommendedData ? recommendedData.rec_soil_temp : 'Loading...'} °C</p>
              <p>Humidity: {recommendedData ? recommendedData.rec_soil_humidity : 'Loading...'} %</p>
              <p>PH: {recommendedData ? recommendedData.rec_soil_pH : 'Loading...'}</p>
              <p>Conductivity: {recommendedData ? recommendedData.rec_soil_conductivity : 'Loading...'} μs/cm</p>
              <p>Nitrogen: {recommendedData ? recommendedData.rec_soil_nitrogen : 'Loading...'} Mg/kg</p>
              <p>Phosphorus: {recommendedData ? recommendedData.rec_soil_phosphorus : 'Loading...'} Mg/kg</p>
              <p>Potassium: {recommendedData ? recommendedData.rec_soil_Potassium : 'Loading...'} Mg/kg</p>
            </div>
          </div>
        </div>
        <img src="/Flower.png" alt="Flower" className="flower-image" />
      </div>

      <div className="right-panel">
        <h2>Water Pump Control</h2>
        {waterLevel < 53 && (
          <div className="alert">
            <p>Water level is low, please add water！</p>
          </div>
        )}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} dataKey="value" innerRadius="70%" outerRadius="90%">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="button-container">
          <button onClick={() => toggleWaterPump('ON')} disabled={automaticMode}>Turn Water Pump ON</button>
          <button onClick={() => toggleWaterPump('OFF')} disabled={automaticMode}>Turn Water Pump OFF</button>
          <button onClick={calibrateUltrasonicSensor}>Calibrate waterPump</button>
        </div>
        <div className="checkbox-container">
          <label>
            <input type="checkbox" checked={automaticMode} onChange={toggleAutomaticMode} />
            Automatic Water Pump Mode
          </label>
        </div>

        <h2>RGB Light Control</h2>
        <img src="/sun.png" alt="sun" className="sun-image" />
        <div className="button-container">
          <button onClick={() => toggleRGBLight('ON')}>Turn RGB Light ON</button>
          <button onClick={() => toggleRGBLight('OFF')}>Turn RGB Light OFF</button>
        </div>
        <div className="checkbox-container">
          <label>
            <input type="checkbox" checked={automaticLightMode} onChange={toggleAutomaticLightMode} />
            Automatic RGB Light Mode
          </label>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
