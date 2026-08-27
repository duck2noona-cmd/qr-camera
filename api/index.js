// Express라는 Node.js용 인기 도구를 불러옵니다.
const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' })); // 이미지 업로드를 위해 용량 제한을 늘림

// 폴더 목록 요청 받기
app.get('/api/folders', (req, res) => {
  // 실제 저장된 폴더 목록을 응답해주는 백엔드 로직
  res.json([
    { id: '1', name: 'A구역 촬영', fileCount: 3 }
  ]);
});

// Vercel에서 작동하도록 서버를 내보냅니다.
module.exports = app;
