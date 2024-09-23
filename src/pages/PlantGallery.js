import React, { useState } from 'react';
import './PlantGallery.css'; // Import the CSS file for styling

function MyPlants() {
  const [plants, setPlants] = useState([
    { id: 1, name: 'Andy', image: 'plant1.png', date: '2023-09-01' },
    { id: 2, name: 'Bob', image: 'plant2.png', date: '2023-09-02' },
  ]);

  const [newPlant, setNewPlant] = useState({
    name: '',
    number: plants.length + 1,
    date: '',
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant({
      ...newPlant,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPlant({
        ...newPlant,
        image: URL.createObjectURL(file) // Temporarily set the uploaded image URL
      });
    }
  };

  const handleAddPlant = () => {
    if (newPlant.name.trim() !== '' && newPlant.date !== '') {
      const plantToAdd = {
        id: newPlant.number,
        name: newPlant.name,
        image: newPlant.image || 'plant-placeholder.png', // Default to placeholder if no image uploaded
        date: newPlant.date
      };
      setPlants([...plants, plantToAdd]);
      setNewPlant({ name: '', number: plants.length + 2, date: '', image: '' });
    }
  };

  const handleDeletePlant = (id) => {
    setPlants(plants.filter((plant) => plant.id !== id));
  };

  return (
    <div className="my-plants-container">
      <h1>My Plants</h1>
      <div className="plants-grid">
        {plants.map((plant) => (
          <div key={plant.id} className="plant-card">
            <img src={plant.image || 'plant-placeholder.png'} alt={plant.name} className="plant-image" />
            <p>#{plant.id} <br /> {plant.name}</p>
            <p>Planted on: {plant.date}</p>
            <button className="delete-plant-btn" onClick={() => handleDeletePlant(plant.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Input for adding a new plant */}
      <div className="add-plant-form">
        <input
          type="text"
          name="name"
          placeholder="Enter plant name"
          value={newPlant.name}
          onChange={handleInputChange}
          className="plant-input"
        />
        <input
          type="number"
          name="number"
          placeholder="Enter plant number"
          value={newPlant.number}
          onChange={handleInputChange}
          className="plant-input"
        />
        <input
          type="date"
          name="date"
          value={newPlant.date}
          onChange={handleInputChange}
          className="plant-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="plant-input"
        />
        <button className="add-plant-btn" onClick={handleAddPlant}>+</button>
      </div>
    </div>
  );
}

export default MyPlants;
