import React, { useEffect, useState } from 'react';
import '../PlantTimeline.css'; // Import the CSS for styling

function PlantTimeline() {  // 确保函数定义完整
  const [images, setImages] = useState({
    day1: '',
    day15: '',
    day30: '',
    day45: ''
  });

  // Fetch images from the shared folder
 // Fetch images from the shared folder
const fetchImagesFromFolder = () => {
  setImages({
    day1: 'http://localhost:5002/images/0_photo_20241001_193019.jpg',  // 新的 Day 1 图片文件
    day15: 'http://localhost:5002/images/1_photo_20241001_193025.jpg',  // 新的 Day 15 图片文件
    day30: 'http://localhost:5002/images/2_photo_20241001_193030.jpg',  // 新的 Day 30 图片文件
    day45: 'http://localhost:5002/images/3_photo_20241001_193036.jpg'   // 新的 Day 45 图片文件
  });
};

  useEffect(() => {
    fetchImagesFromFolder();
  }, []);

  return (
    <div className="timeline-container">
      <h1>Plant Growth Timeline</h1>
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
