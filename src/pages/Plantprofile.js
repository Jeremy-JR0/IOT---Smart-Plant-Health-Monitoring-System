import React, { useState, useEffect } from 'react';
import '../PlantGallery.css'; // Import the CSS file for styling

function PlantSearch() {
  const [plantInfo, setPlantInfo] = useState(''); // Plant identification results
  const [searchQuery, setSearchQuery] = useState(''); // User's search input
  const [chatResponse, setChatResponse] = useState(''); // Chat API response
  const [plantName, setPlantName] = useState(''); // Plant name
  const [plantAvatar, setPlantAvatar] = useState(null); // Plant avatar image file
  const [plantDescription, setPlantDescription] = useState(''); // Plant description
  const [plantDate, setPlantDate] = useState(''); // Planting date
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Fetch the first image from uploads directory on mount
  // 使用新的路由 /api/images/uploads
useEffect(() => {
    fetch('http://localhost:5002/api/images/uploads')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch images from uploads');
            }
            return response.json();
        })
        .then((images) => {
            if (images && images.length > 0) {
                setPlantAvatar(`http://localhost:5002/uploads/${images[0]}`);
            }
        })
        .catch((error) => console.error("Error fetching images:", error));
}, []);

  // Handle avatar replacement and plant identification
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPlantAvatar(URL.createObjectURL(file)); // Display image

      // Convert the file to a blob and upload it to the PlantNet API
      const formData = new FormData();
      formData.append('images', file);

      try {
        const response = await fetch('https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&nb-results=10&lang=en&api-key=2b10qBBsSVf9aXG04dEUCYzRO', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Plant Identification Response:', result);

        const firstPlant = result.results[0];
        if (firstPlant) {
          const scientificName = firstPlant.species?.scientificName || 'Unknown Scientific Name';
          setPlantName(scientificName); // Automatically fill the plant name input
        } else {
          setPlantInfo(<p>No plant data available</p>);
        }
      } catch (error) {
        console.error('Error identifying the plant:', error);
      }
    }
  };

  // Handle avatar click to trigger file upload
  const handleAvatarClick = () => {
    document.getElementById('avatarInput').click();
  };

  // Handle form submission to display the modal
  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="plant-search-container">
      <div className="avatar-upload" onClick={handleAvatarClick}>
        <input
          type="file"
          id="avatarInput"
          className="avatar-input"
          accept="image/*"
          onChange={handleAvatarUpload}
          style={{ display: 'none' }} // Hide the file input
        />
        {plantAvatar && <img src={plantAvatar} alt="Plant Avatar" className="plant-avatar" />}
      </div>
      <div className="nickname-input">
        <label htmlFor="plantName">Plant Name</label>
        <input
          type="text"
          id="plantName"
          className="text-input"
          placeholder="Enter plant name"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)} // Allow manual edit of plant name
        />
      </div>

      <div className="date-input">
        <label htmlFor="plantDate">Planting Date (dd/mm/yyyy)</label>
        <input
          type="date"
          id="plantDate"
          className="text-input"
          value={plantDate}
          onChange={(e) => setPlantDate(e.target.value)}
        />
      </div>

      <div className="description-input">
        <label htmlFor="plantDescription">Plant Description</label>
        <textarea
          id="plantDescription"
          className="text-area"
          placeholder="Describe your plant..."
          value={plantDescription}
          onChange={(e) => setPlantDescription(e.target.value)}
        />
      </div>

      <div className="submit-btn">
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Plant Information</h2>
            <p><strong>Name:</strong> {plantName}</p>
            <p><strong>Planting Date:</strong> {plantDate}</p>
            <p><strong>Description:</strong> {plantDescription}</p>
            {plantInfo && <div className="plant-info-modal">{plantInfo}</div>}
            <button onClick={() => setIsModalOpen(false)}>Close</button>
            <button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantSearch;
