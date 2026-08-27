const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' })); // 사진 용량을 고려한 설정

// 메모리 기반 폴더/사진 데이터 저장소 (Vercel Serverless용)
let store = {};

// 1. 작업 폴더 목록 조회
app.get('/api/folders', (req, res) => {
  const { deviceId } = req.query;
  if (!deviceId) return res.json([]);
  
  if (!store[deviceId]) {
    store[deviceId] = [];
  }
  
  const folders = store[deviceId].map(f => ({
    id: f.id,
    name: f.name,
    fileCount: f.photos.length
  }));
  
  res.json(folders);
});

// 2. 새 작업 폴더 생성
app.post('/api/folders', (req, res) => {
  const { deviceId, name } = req.body;
  if (!deviceId || !name) return res.status(400).json({ error: '필수 값 누락' });

  if (!store[deviceId]) store[deviceId] = [];

  const newFolder = {
    id: 'f_' + Date.now(),
    name: name,
    photos: []
  };

  store[deviceId].push(newFolder);
  res.json({ success: true, folder: newFolder });
});

// 3. 작업 폴더 삭제
app.delete('/api/folders/:id', (req, res) => {
  const { id } = req.params;
  
  for (const dev in store) {
    store[dev] = store[dev].filter(f => f.id !== id);
  }
  
  res.json({ success: true });
});

// 4. 사진 전송 및 저장
app.post('/api/upload', (req, res) => {
  const { folderId, qrValue, image } = req.body;

  let targetFolder = null;
  for (const dev in store) {
    const found = store[dev].find(f => f.id === folderId);
    if (found) {
      targetFolder = found;
      break;
    }
  }

  if (!targetFolder) {
    return res.status(404).json({ error: '폴더를 찾을 수 없습니다.' });
  }

  const rawName = qrValue.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
  const sameCount = targetFolder.photos.filter(p => p.rawName === rawName).length;
  
  let fileName = `${rawName}.jpg`;
  if (sameCount === 1) fileName = `${rawName}_(중복).jpg`;
  else if (sameCount > 1) fileName = `${rawName}_(중복${sameCount}).jpg`;

  targetFolder.photos.push({
    rawName,
    fileName,
    image,
    createdAt: new Date()
  });

  res.json({ success: true, fileName });
});

module.exports = app;
