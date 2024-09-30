import React, { useState } from 'react';
import '../PlantCareAI.css'; // Import the CSS file for styling

function PlantSearch() {
  const [plantInfo, setPlantInfo] = useState(''); // Plant identification results
  const [searchQuery, setSearchQuery] = useState(''); // User's search input
  const [chatResponse, setChatResponse] = useState(''); // Chat API response

  // Handle file capture (camera or file upload)
  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Captured file:", file);

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
        console.log("Plant Identification Response:", result);

        // Extract plant information from the first result
        const firstPlant = result.results[0];
        if (firstPlant) {
          const scientificName = firstPlant.species?.scientificName || 'Unknown Scientific Name';
          const genusName = firstPlant.species?.genus?.scientificName || 'Unknown Genus';
          const familyName = firstPlant.species?.family?.scientificName || 'Unknown Family';
          const commonNames = firstPlant.species?.commonNames?.join(', ') || 'No common names available';

          // Set the plant information to only display the first result
          const plantDetails = (
            <div key="1">
              <h3>Plant</h3>
              <p><strong>Scientific Name:</strong> {scientificName}</p>
              <p><strong>Genus:</strong> {genusName}</p>
              <p><strong>Family:</strong> {familyName}</p>
              <p><strong>Common Names:</strong> {commonNames}</p>
            </div>
          );

          setPlantInfo(plantDetails); // Set the plant information
        } else {
          setPlantInfo(<p>No plant data available</p>);
        }
      } catch (error) {
        console.error('Error identifying the plant:', error);
      }
    }
  };

  // Handle search input and make an API call to Chat API
  const handleChatGPTQuery = async () => {
    if (searchQuery) {
      try {
        const response = await fetch('https://api.deepbricks.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk-Ya1lYbp8LYSBosl7WLBiWcaYCBaWCRoRMlABV0UBPubQPghg` // Replace with your actual key
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: searchQuery }],
            max_tokens: 500 // Increased token limit to allow for longer responses
          })
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        const chatCompletion = data.choices[0]?.message?.content || 'No response from ChatGPT';
  
        // Update the state with the ChatGPT response
        setChatResponse(chatCompletion);
      } catch (error) {
        console.error('Error fetching chat response:', error);
        setChatResponse('Error fetching chat response.');
      }
    }
  };

  return (
    <div className="plant-search-container">
      <h1>Learn more about your plants</h1>
      <img src="/Picture4.png" alt="Plant" className="plant-image" />

      <div className="camera-capture">
        <label htmlFor="cameraInput" className="camera-label">
          Capture with Camera
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment" // Use the rear camera on mobile devices
          id="cameraInput"
          className="camera-input"
          onChange={handleCapture} // This should work correctly now
        />
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search your plant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleChatGPTQuery(); }} // Trigger on Enter key
        />
      </div>

      {/* Display plant info from API */}
      {plantInfo && <div className="plant-info">{plantInfo}</div>}

      {/* Display ChatGPT API response */}
      {chatResponse && <div className="chat-response"><h3>Plant AI assistant</h3><p>{chatResponse}</p></div>}
    </div>
  );
}

export default PlantSearch;
