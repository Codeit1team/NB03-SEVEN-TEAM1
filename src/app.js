import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://seven.mimu.live:3000'
];

// 환경 변수 로딩
dotenv.config();

// 핸들러
import errorHandler from '#middlewares/errorHandler.js';

// 라우터
import groupRoutes from '#routes/groupRoutes.js';
import recordRoutes from '#routes/recordRoutes.js';
import participantRoutes from '#routes/participantRoutes.js'

const app = express();
const PORT = process.env.PORT || 3001;

// 보안 미들웨어
app.use(helmet());

// 요청 바디 json 파싱
app.use(express.json());

// form-urlencoded 바디 파싱
app.use(express.urlencoded({ extended: true }));

// cors
app.use('/api/uploads', cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  //credentials: true
}));

// 정적 파일 서빙(매핑)
// /uploads 경로로 들어오는 요청을 uploads/ 폴더 내부의 실제 파일로 매핑
// 예) uploads/image.jpg → http://localhost:3001/uploads/image.jpg
import uploadRoutes from './routes/uploadRoutes.js';

app.use('/api/uploads', uploadRoutes);
app.use('/api/uploads', express.static('uploads'));
app.use('/api/participants', participantRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/records', recordRoutes);

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