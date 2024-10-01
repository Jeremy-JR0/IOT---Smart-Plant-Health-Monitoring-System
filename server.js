const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// 照片文件夹
const imagesDir = path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, 'Downloads', 'plant_life_line');

// 读取照片文件，并解析文件名中的时间戳
const getPhotosWithTimestamps = () => {
  const files = fs.readdirSync(imagesDir);
  const photos = {
    day1: '',
    day15: '',
    day30: '',
    day45: ''
  };

  files.forEach(file => {
    const match = file.match(/_(\d{8}_\d{6})\.jpg$/); // 提取时间戳
    if (match) {
      const timestamp = match[1];  // 例如 "20241001_193019"
      const date = new Date(timestamp.slice(0, 4), timestamp.slice(4, 6) - 1, timestamp.slice(6, 8));
      const now = new Date();  // 当前日期
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));  // 计算天数差

      if (diffDays <= 1) {
        photos.day1 = `/images/${file}`;
      } else if (diffDays <= 15) {
        photos.day15 = `/images/${file}`;
      } else if (diffDays <= 30) {
        photos.day30 = `/images/${file}`;
      } else if (diffDays <= 45) {
        photos.day45 = `/images/${file}`;
      }
    }
  });

  return photos;
};

// 提供静态资源文件夹
app.use('/images', express.static(imagesDir));

// 获取照片接口
app.get('/photos', (req, res) => {
  const photos = getPhotosWithTimestamps();
  res.json(photos);
});

app.listen(5002, () => {
  console.log('Server is running on http://localhost:5002');
});

