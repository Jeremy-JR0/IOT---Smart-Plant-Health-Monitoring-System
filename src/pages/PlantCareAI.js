import React, { useState } from 'react';
import '../PlantCareAI.css'; // Import the CSS file for styling

function PlantSearch() {
  const [plantInfo, setPlantInfo] = useState('');
  
  // Placeholder function to handle file upload (camera capture)
  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Captured file:", file);
      // TODO: Handle file upload and processing (e.g., send to a server or AI API for analysis)
    }
  };

  // Placeholder function for ChatGPT API call
  const handleChatGPTQuery = async () => {
    // TODO: Replace with actual API call to OpenAI ChatGPT
    const prompt = 'Learn more about plant care based on user input.';
    const response = await fetch('/api/chatgpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with actual API Key
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 100,
      }),
    });
    const data = await response.json();
    console.log("ChatGPT response:", data);
    setPlantInfo(data.text); // Update state with the response
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
          onChange={handleCapture}
        />
      </div>

      <div className="search-bar">
        <button className="plus-btn" onClick={handleChatGPTQuery}>+</button>
        <input
          type="text"
          className="search-input"
          placeholder="Search your plant..."
        />
        <button className="send-btn" onClick={handleChatGPTQuery}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#2F8F22"
            width="24px"
            height="24px"
          >
            <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
          </svg>
        </button>
      </div>

      {/* Display plant info from ChatGPT API */}
      {plantInfo && <div className="plant-info">{plantInfo}</div>}
    </div>
  );
}

export default PlantSearch;
