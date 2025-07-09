import dotenv from 'dotenv';
import fs from 'fs';

// 실행환경 분기
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

// 환경 설정
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;

// BASE_URL은 실행환경에 따라 다르게 적용
const BASE_URL = isProd
  ? process.env.BASE_URL
  : `${process.env.BASE_URL_DEV}:${PORT}`;

const FRONT_PORT = process.env.FRONT_PORT || 3000;
const FRONT_ORIGIN = isProd
  ? process.env.BASE_URL
  : `${process.env.BASE_URL_DEV}:${FRONT_PORT}`;

const allowedOrigins = [FRONT_ORIGIN];
const currentImageHost = `${BASE_URL}/api/files`;

// 핸들러 및 라우터
import errorHandler from '#middlewares/errorHandler.js';
import uploadRoutes from '#routes/uploadRoutes.js';
import groupRoutes from '#routes/groupRoutes.js';
import recordRoutes from '#routes/recordRoutes.js';
import participantRoutes from '#routes/participantRoutes.js';
import tagRoutes from '#routes/tagRoutes.js';

const app = express();

app.locals.BASE_URL = BASE_URL;

 // proxy trust 설정. Cloudflare 1-hop 프록시 고려
app.set('trust proxy', 1);

// 보안 설정
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', currentImageHost],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
    },
  },
}));

// 요청 속도 제한
app.use(rateLimit({
  windowMs: 10 * 60 * 1_000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
}));

// 요청 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 설정 (업로드 이미지 접근 허용 위함)
app.use('/api/files', cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));

// 정적 파일 서빙
app.use('/api/files', express.static('uploads'));

// API 라우터 연결
app.use('/api/uploads', uploadRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/tags', tagRoutes);

// 공통 에러 핸들러
app.use(errorHandler);

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// 예외 처리
process.on('unhandledRejection', (reason, promise) => {
  console.error('🧨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception thrown:', err);
  process.exit(1);
});