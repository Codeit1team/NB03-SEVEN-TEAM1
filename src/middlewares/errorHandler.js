import { StructError } from 'superstruct';
import getStructErrorMessage from '#utils/getStructErrorMessage.js';

/**
 * Express 글로벌 에러 핸들러
 *
 * @param {Error} err - 발생한 에러 객체
 * @param {import('express').Request} req - 요청 객체
 * @param {import('express').Response} res - 응답 객체
 * @param {Function} next - 다음 미들웨어
 */
export default (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // 에러 로그 출력(환경에 따라 분기)
  if (isDev) {
    console.error('🔴 Error:', err);
  } else {
    console.error('🔴', err.message);
  }

  // 이미 처리된 메시지는 그대로 반환
  if (typeof err.message === 'string' && err.message.endsWith('니다')) {
    return res.status(err.status || 400).json({
      success: false,
      message: err.message,
    });
  }

  // superstruct 유효성 검사 오류 처리
  if (err instanceof StructError) {
    return res.status(400).json({
      success: false,
      message: getStructErrorMessage(err),
      path: err.path,
    });
  }

  // Prisma 오류 처리
  if (err.name === 'PrismaClientKnownRequestError') {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: '이미 존재하는 값입니다.',
          ...(isDev ? { target: err.meta?.target } : {}),
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: '존재하지 않는 항목입니다.',
          ...(isDev ? { target: err.meta?.target } : {}),
        });
      default:
        return res.status(400).json({
          success: false,
          message: '데이터베이스 처리 중 오류가 발생했습니다.',
          ...(isDev ? { code: err.code, detail: err.meta } : {}),
        });
    }
  }

  // 그 외 에러 처리
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};