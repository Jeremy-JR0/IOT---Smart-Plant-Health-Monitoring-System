// App.js
import React, { useState, useEffect } from 'react';
import '../dashboardpage.css';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  // Placeholder for API call to fetch dashboard data
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchDashboardData = async () => {
      const data = {
        basic: {
          airTemperature: 16,
          airHumidity: 78,
          lightBrightness: 1000,
          waterTankVolume: 20
        },
        soil: {
          soilTemperature: 8,
          soilHumidity: 30,
          pH: 7.5,
          waterRetention: 20
        }
      };
      setDashboardData(data);
    };
    fetchDashboardData();
  }, []);

  // Placeholder for API call to fetch watering history
  useEffect(() => {
    // TODO: Replace with actual API call
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
      <header className="header">
        <h1>Andy's Plant Data</h1>
      </header>

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
