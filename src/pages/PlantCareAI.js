import React, { useState } from 'react';
import '../PlantCareAI.css';

function PlantSearch() {
  const [plantInfo, setPlantInfo] = useState(''); 
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  // 控制相机的函数
  const toggleCamera = (action) => {
    fetch('https://u70oktpbs1.execute-api.ap-southeast-2.amazonaws.com/rgbled/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'rgbLED/control', message: action }),
    }).catch(error => console.error('Error controlling camera:', error));
  };

  // 从 uploads 文件夹获取最新照片并上传检测
  const handleTakePhoto = async () => {
    toggleCamera('ON'); // 启动相机拍摄
    try {
      // 获取 uploads 目录中的照片文件列表
      const response = await fetch('http://localhost:5002/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch image list from uploads');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('No images found in uploads');
      }
      // 获取最新（按时间排序后第一个）图片
      const latestImage = data[data.length - 1];
      const imageUrl = `http://localhost:5002/uploads/${latestImage}`;
      setUploadedImage(imageUrl); // 显示获取到的照片
      setCameraError('');

      const imgResponse = await fetch(imageUrl);
      const imgBlob = await imgResponse.blob();
      await identifyPlant(imgBlob);
    } catch (error) {
      console.error('Error accessing photo:', error);
      setCameraError('Unable to access photos. Please check connection.');
    } finally {
      toggleCamera('OFF'); // 拍摄完成后关闭相机
    }
  };

  // 上传照片到植物健康状态检测 API
  const identifyPlant = async (blob) => {
    const formData = new FormData();
    formData.append('images', blob, 'photo.jpg');

    try {
      const response = await fetch('https://plant.id/api/v3/health_assessment', {
        method: 'POST',
        headers: {
          'Api-Key': 'lygqLRbAsdaSwJLFhRiVJwdNGD2j0igPcAeh2Nm0vuBUIedH7h',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const suggestions = result.result?.disease?.suggestions;
      if (suggestions && suggestions.length > 0) {
        const healthInfo = suggestions.map((suggestion) => {
          const probabilityPercentage = (suggestion.probability * 100).toFixed(2);
          return `Disease: ${suggestion.name}, Probability: ${probabilityPercentage}%`;
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

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        const binary = atob(base64data);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        identifyPlant(blob);
        const imageUrl = URL.createObjectURL(blob);
        setUploadedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.deepbricks.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-Ya1lYbp8LYSBosl7WLBiWcaYCBaWCRoRMlABV0UBPubQPghg'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: chatInput }],
        }),
      });

      if (!response.ok) {
        throw new Error('Error fetching chat response');
      }

      const data = await response.json();
      const botMessage = {
        sender: 'bot',
        text: data.choices[0].message.content,
      };

      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Error retrieving response. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plant-search-container">
      <h1>Know more about your plants</h1>

      <div className="button-container">
        <input type="file" id="upload" style={{ display: 'none' }} onChange={handleUpload} />
        <button onClick={() => document.getElementById('upload').click()}>Upload</button>
        <button onClick={handleTakePhoto}>Take Photo</button>
      </div>

      {cameraError && <p className="error">{cameraError}</p>}

      <div className="image-display">
        {uploadedImage && <img src={uploadedImage} alt="Captured from Raspberry Pi" />}
      </div>

      <div className="plant-info">
        {plantInfo && (
          <table>
            <thead>
              <tr>
                <th>Disease</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {plantInfo.split('Disease: ').slice(1).map((info, index) => {
                const [disease, probability] = info.split(', Probability: ');
                return (
                  <tr key={index}>
                    <td>{disease.trim()}</td>
                    <td>{probability.trim()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className={`chat-widget ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
          <img src="/Picture2.png" alt="Chat" />
        </div>
        {isChatOpen && (
          <div className="chat-box">
            <div className="chat-header">
              <h3>Plant AI Assistant</h3>
            </div>
            <div className="chat-body">
              {chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.sender}`}>
                  <p>{message.text}</p>
                </div>
              ))}
              {isLoading && <div className="chat-message bot">Typing...</div>}
            </div>
            <form onSubmit={handleChatSubmit} className="chat-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantSearch;
