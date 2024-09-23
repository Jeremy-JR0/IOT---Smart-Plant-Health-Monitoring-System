import React from 'react';
import '../startpage.css'; // Ensure the correct file name for your CSS file

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Smart plant care system</h1>
        <p>It's time to water your plant ...</p>
        <button className="start-button" onClick={() => window.location.href = 'http://localhost:3000/dashboard'}>
  let's get started
</button>
      </header>
      <div className="image-container">
        {/* Use the correct path to the image */}
        <img src="/Picture1.png" alt="Farmer watering plants" className="farmer-image" />
      </div>
    </div>
  );
}

export default App;
