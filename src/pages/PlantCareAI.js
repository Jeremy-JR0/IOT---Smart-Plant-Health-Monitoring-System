import React, { useState, useRef } from 'react';
import '../PlantCareAI.css';

function PlantSearch() {
  const [plantInfo, setPlantInfo] = useState(''); 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  // 识别植物信息的函数
  const identifyPlant = async (formData) => {
    try {
      const response = await fetch('https://plant.id/api/v3/health_assessment', {
        method: 'POST',
        headers: {
          'Api-Key': 'lygqLRbAsdaSwJLFhRiVJwdNGD2j0igPcAeh2Nm0vuBUIedH7h',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          images: formData,
          latitude: 49.207,
          longitude: 16.608,
          similar_images: true
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('API response:', result);
  
      // 提取疾病建议信息
      const suggestions = result.result?.disease?.suggestions;
      if (suggestions && suggestions.length > 0) {
        const healthInfo = suggestions.map((suggestion) => {
          return `Disease: ${suggestion.name}, Probability: ${suggestion.probability}`;
        }).join("\n");
  
        setPlantInfo(healthInfo);
      } else {
        setPlantInfo('No disease suggestions found.');
      }
    } catch (error) {
      console.error('Error identifying the plant:', error);
      setPlantInfo('Error identifying the plant.');
    }
  };
  

  

  // 启动相机
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraError('');
    } catch (error) {
      console.error('Error accessing the camera:', error);
      setCameraError('Unable to access camera. Please check permissions.');
    }
  };

  // 捕获相机照片并调用identifyPlant
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('images', blob, 'photo.jpg');
      identifyPlant(formData);
    }, 'image/jpeg');
  };

  // 上传照片并调用identifyPlant
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1]; // 去掉前缀部分
        identifyPlant([`data:image/jpeg;base64,${base64data}`]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="plant-search-container">
      <h1>Know more about your plants</h1>

      <div className="button-container">
        <input type="file" id="upload" style={{ display: 'none' }} onChange={handleUpload} />
        <button onClick={() => document.getElementById('upload').click()}>Upload</button>
        <button onClick={handleTakePhoto}>Take Photo</button>
        <button onClick={capturePhoto}>Identify</button>
      </div>

      {cameraError && <p className="error">{cameraError}</p>}
      <video ref={videoRef} width="320" height="240" autoPlay style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <div className="image-display">
        {uploadedImage && <img src={uploadedImage} alt="Uploaded Preview" />}
      </div>

      <div className="plant-info">
        {plantInfo && <p>{plantInfo}</p>}
      </div>
    </div>
  );
}

export default PlantSearch;
