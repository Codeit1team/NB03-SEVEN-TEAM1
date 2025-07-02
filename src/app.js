import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

// 핸들러
import errorHandler from '#middlewares/errorHandler.js';

/* 라우터
import rankingRoutes from '#routes/rankingRoutes.js';
*/
import groupRoutes from '#routes/groupRoutes.js';
import recordRoutes from '#routes/recordRoutes.js';

// 환경 변수 로딩
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 보안 미들웨어
app.use(helmet());

// 요청 바디 json 파싱
app.use(express.json());

// form-urlencoded 바디 파싱
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙(매핑)
// /uploads 경로로 들어오는 요청을 uploads/ 폴더 내부의 실제 파일로 매핑
// 예) uploads/image.jpg → http://localhost:3000/uploads/image.jpg
app.use('/uploads', express.static('uploads'));

// /api 하위로 모든 경로 마운트. cors 생략 위함. fe-be
app.use('/api/groups', participantRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/rankings', rankingRoutes);

// 공통 에러 핸들러
app.use(errorHandler);

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// 비동기 예외 핸들링
process.on('unhandledRejection', (reason, promise) => {
  console.error('🧨 Unhandled Rejection at:', promise, 'reason:', reason);
});

// 동기 예외 핸들링
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception thrown:', err);
  process.exit(1);
});