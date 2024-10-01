import React, { useState, useEffect } from 'react';
import '../dashboardpage.css';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  // Fetch sensor data from the actual API
  useEffect(() => {
    const fetchDashboardData = async () => {
      const apiUrl = 'https://9wohjilbw6.execute-api.ap-southeast-2.amazonaws.com/data/RetrieveSensorData';

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        // Assuming the latest data is the last item in the array
        const latestData = data[data.length - 1];
        const dashboardData = {
          basic: {
            airTemperature: latestData.payload.temperature,
            airHumidity: latestData.payload.humidity,
            lightBrightness: latestData.payload.light_level,
            waterTankVolume: 20 // Placeholder as it's not available from the sensor data
          },
          soil: {
            soilTemperature: latestData.soilTemperature, // Placeholder as it's not available from the sensor data
            soilHumidity: latestData.payload.soil_moisture,
            pH: latestData.payload.ph_level,
            waterRetention: 20 // Placeholder as it's not available from the sensor data
          }
        };

        setDashboardData(dashboardData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Placeholder for API call to fetch watering history
  useEffect(() => {
    const fetchHistoryData = async () => {
      const history = [
        { date: '2024/08/31', amount: '150ml' },
        { date: '2024/09/02', amount: '250ml' },
        { date: '2024/09/15', amount: '150ml' },
        { date: '2024/09/30', amount: '180ml' },
        { date: '2024/10/01', amount: '130ml' }
      ];
      setHistoryData(history);
    };
    fetchHistoryData();
  }, []);

  return (
    <div className="container">
      {dashboardData && (
        <div className="dashboard">
          <div className="data-section">
            <h2>Basic</h2>
            <div className="data-card">
              <p>🌡 {dashboardData.basic.airTemperature}°C<br />Air Temperature</p>
              <p>💧 {dashboardData.basic.airHumidity}%<br />Air Humidity</p>
              <p>☀️ {dashboardData.basic.lightBrightness} LX<br />Light Brightness</p>
              <p>💧 {dashboardData.basic.waterTankVolume}%<br />Water Tank Volume</p>
            </div>
          </div>

          <div className="data-section">
            <h2>Soil</h2>
            <div className="data-card">
              <p>🌡 {dashboardData.soil.soilTemperature}°C<br />Soil Temperature</p>
              <p>💧 {dashboardData.soil.soilHumidity}%<br />Soil Humidity</p>
              <p>🌱 {dashboardData.soil.pH}<br />Soil pH</p>
              <p>💧 {dashboardData.soil.waterRetention}%<br />Water Retention</p>
            </div>
          </div>
        </div>
      )}

      <div className="buttons">
        <button className="btn">Watering</button>
        <button className="btn">Light</button>
      </div>

      <div className="history">
        <h2>Andy Watering Record</h2>
        <p>💧 Water calculator<br />This plant needs ≈500ml per watering</p>
        {historyData && (
          <div className="history-record">
            {historyData.map((record, index) => (
              <p key={index}>{record.date} {record.amount}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
