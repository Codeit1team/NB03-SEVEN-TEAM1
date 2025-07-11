import dotenv from 'dotenv';
import fs from 'fs';

// 환경 변수 로드
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

import errorHandler from '#middlewares/errorHandler.js';
import { tempFileCleanerJob } from '#crons/cleanTempUploads.js';
import uploadRoutes from '#routes/uploadRoutes.js';
import groupRoutes from '#routes/groupRoutes.js';
import recordRoutes from '#routes/recordRoutes.js';
import participantRoutes from '#routes/participantRoutes.js';
import tagRoutes from '#routes/tagRoutes.js';

// 환경 설정
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;
const FRONT_PORT = process.env.FRONT_PORT || 3000;

const BASE_URL = isProd
  ? process.env.BASE_URL
  : `${process.env.BASE_URL_DEV}:${PORT}`;

const FRONT_ORIGIN = isProd
  ? process.env.BASE_URL
  : `${process.env.BASE_URL_DEV}:${FRONT_PORT}`;

const allowedOrigins = [FRONT_ORIGIN];
const currentImageHost = `${BASE_URL}/api/files`;

// 서버 초기화
const app = express();

// 프록시 신뢰 설정 (Cloudflare 등)
app.set('trust proxy', 1);

// cron 작업 시작(임시 파일 정리)
tempFileCleanerJob.start();

// 보안 헤더 설정
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

// 요청 본문 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 접근용 CORS 설정
app.use('/api', cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));

// 업로드된 파일 정적 서빙
app.use('/api/files', express.static('uploads'));

// API 라우팅
app.use('/api/uploads', uploadRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/tags', tagRoutes);

// 공통 에러 핸들러
app.use(errorHandler);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 예외 처리
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});