const express = require('express');
const app = express();

// 사진 데이터(Base64)가 포함되므로 용량 제한을 10MB로 설정
app.use(express.json({ limit: '10mb' }));

// 1. 서버 상태 체크 API
app.get('/api/folders', (req, res) => {
  res.json({ message: "API가 정상 동작 중입니다." });
});

// 2. 사진 업로드 처리 API
app.post('/api/upload', (req, res) => {
  const { folderName, qrValue, image } = req.body;

  if (!folderName) {
    return res.status(400).json({ error: '폴더 이름이 전달되지 않았습니다.' });
  }

  if (!qrValue || !image) {
    return res.status(400).json({ error: 'QR 코드 또는 이미지 데이터가 누락되었습니다.' });
  }

  // 파일명 정제 (특수문자는 _로 변경)
  const rawName = qrValue.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
  const fileName = `${rawName}.jpg`;

  res.json({
    success: true,
    folderName: folderName,
    fileName: fileName,
    message: `[${folderName}] 폴더에 저장 성공`
  });
});

module.exports = app;
