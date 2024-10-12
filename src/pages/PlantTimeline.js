import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../PlantTimeline.css';

// URL for retrieving sensor data
const apiUrl = 'https://9wohjilbw6.execute-api.ap-southeast-2.amazonaws.com/data/RetrieveSensorData';

// Define sensor metrics
const metrics = [
    { key: 'temperature', label: 'Air Temperature (°C)', color: '#FF5722' },
    { key: 'humidity', label: 'Air Humidity (%)', color: '#4CAF50' },
    { key: 'light_level', label: 'Light Level (lux)', color: '#FFC107' },
    { key: 'soil_humidity', label: 'Soil Humidity (%)', color: '#FF9800' },
    { key: 'soil_temp', label: 'Soil Temperature (°C)', color: '#673AB7' },
    { key: 'soil_ph', label: 'Soil pH', color: '#F44336' },
    { key: 'soil_conductivity', label: 'Soil Conductivity (μS/cm)', color: '#9C27B0' },
    { key: 'soil_N', label: 'Soil Nitrogen (mg/kg)', color: '#03A9F4' },
    { key: 'soil_phosphorus', label: 'Soil Phosphorus (mg/kg)', color: '#8BC34A' },
    { key: 'soil_potassium', label: 'Soil Potassium (mg/kg)', color: '#FFEB3B' }
];

// Component to display image timeline
function PlantTimeline() {
    const [images, setImages] = useState([]);

    // Function to fetch images from the server
    const fetchImagesFromFolder = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/images');
            const data = await response.json();
            const imageUrls = data.map(fileName => `http://localhost:5002/uploads/${fileName}`);
            setImages(imageUrls);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        fetchImagesFromFolder();
    }, []);

    return (
        <div className="plant-timeline">
            <h2>Plant Image Timeline</h2>
            <div className="image-container">
                {images.map((url, index) => (
                    <div key={index} className="timeline-item">
                        <img src={url} alt={`Plant Day ${index + 1}`} className="plant-image" />
                        <p>Day {index + 1}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Main App component
const App = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error loading data. Please try again later.');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="App">

            {/* Plant Timeline Component */}
            <PlantTimeline />

            {/* Charts for sensor data */}
            <main>
                {loading && <div id="loading">Loading data...</div>}
                {error && <div className="error">{error}</div>}
                {!loading && !error && metrics.map(metric => (
                    <section key={metric.key} className="chart-section">
                        <h2>{metric.label}</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.map(record => ({
                                timestamp: record.timestamp ? new Date(record.timestamp).toLocaleString() : 'N/A',
                                value: parseFloat(record.payload?.[metric.key] || null)
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke={metric.color} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </section>
                ))}
            </main>

            {/* Timeline PNG at the bottom */}
            <div className="timeline-png-container">
                <img src="/timeline.png" alt="Timeline" className="timeline-png" />
            </div>
        </div>
    );
};

export default App;
