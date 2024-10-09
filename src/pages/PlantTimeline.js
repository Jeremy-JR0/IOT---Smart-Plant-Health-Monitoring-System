import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../PlantTimeline.css';

function PlantTimeline() {
  const [images, setImages] = useState([]);
  const [sensorData, setSensorData] = useState([]);

  // Function to fetch image file names from the server
  const fetchImagesFromFolder = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/images');
      const data = await response.json();
      // Convert file names to URLs
      const imageUrls = data.map(fileName => `http://localhost:5002/uploads/${fileName}`);
      setImages(imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchSensorData = async () => {
    try {
      const response = await fetch('https://9wohjilbw6.execute-api.ap-southeast-2.amazonaws.com/data/RetrieveSensorData');
      const data = await response.json();
      setSensorData(prevData => [...prevData, ...data.map(item => ({
        ...item,
        time: new Date(item.timestamp).toLocaleTimeString()
      }))]);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    fetchImagesFromFolder();
    fetchSensorData();
    const interval = setInterval(() => {
      fetchSensorData();
    }, 7200000); // 2 hours

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timeline-container">
      <h1>Plant Timeline</h1>
      <div className="timeline">
        {images.map((imageUrl, index) => (
          <div className="timeline-item" key={index}>
            <img src={imageUrl} alt={`Day ${index + 1}`} className="timeline-image" />
            <p>{`DAY ${index + 1}`}</p>
          </div>
        ))}
      </div>
      {/* Two columns: One for Air data, one for Soil data */}
      <div className="chart-columns">
        {/* Column for Air Data */}
        <div className="chart-column air-column">
          <h2>Air Data</h2>
          
          {/* Brightness Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.light_level}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="air.brightness" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>

          {/* Temperature Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.temperature}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="air.temperature" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>

          {/* Humidity Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.humidity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="air.humidity" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Column for Soil Data */}
        <div className="chart-column soil-column">
          <h2>Soil Data</h2>
          
          {/* Moisture Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.soil_temp}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil.moisture" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>

          {/* Temperature Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.soil_humidity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil.temperature" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>

          {/* pH Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.soil_ph}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil.ph" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>

          {/* Nutrient1 Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.soil_conductivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil.conductivity" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>

          {/* Nutrient2 Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.soil_nitrogen}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil.nitrogen" stroke="#d2691e" />
            </LineChart>
          </ResponsiveContainer>

          {/* Nutrient3 Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.soil_phosphorus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil.phosphorus" stroke="#228B22" />
            </LineChart>
          </ResponsiveContainer>

          {/* Nutrient4 Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData.soil_potassium}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soil.potassium" stroke="#B22222" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add the timeline PNG at the bottom */}
      <div className="timeline-png-container">
        <img src="/timeline.png" alt="Timeline" className="timeline-png" />
      </div>
    </div>
  );
}

export default PlantTimeline;