import React, { useEffect, useState } from 'react';
import '../PlantTimeline.css'; // Import the CSS for styling

function PlantTimeline() {
  const [images, setImages] = useState({
    day1: '',
    day15: '',
    day30: '',
    day45: ''
  });

  // Simulate fetching images from Raspberry Pi's Samba folder
  useEffect(() => {
    // Placeholder function to simulate image retrieval
    const fetchImagesFromSamba = async () => {
      try {
        // Placeholder logic for retrieving images from Samba folder on Raspberry Pi
        // Replace these URLs with actual paths once Samba integration is done
        setImages({
          day1: '/path-to-samba/day1-image.jpg',
          day15: '/path-to-samba/day15-image.jpg',
          day30: '/path-to-samba/day30-image.jpg',
          day45: '/path-to-samba/day45-image.jpg'
        });
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImagesFromSamba();
  }, []);

  return (
    <div className="timeline-container">
      <h1>Plant growth timeline</h1>
      <div className="timeline">
        <div className="timeline-item">
          <img src={images.day1} alt="Day 1" className="timeline-image" />
          <p>DAY 1</p>
        </div>
        <div className="timeline-item">
          <img src={images.day15} alt="Day 15" className="timeline-image" />
          <p>DAY 15</p>
        </div>
        <div className="timeline-item">
          <img src={images.day30} alt="Day 30" className="timeline-image" />
          <p>DAY 30</p>
        </div>
        <div className="timeline-item">
          <img src={images.day45} alt="Day 45" className="timeline-image" />
          <p>DAY 45</p>
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
