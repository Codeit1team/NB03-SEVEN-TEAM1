import { StructError } from 'superstruct';
import getStructErrorMessage from '#utils/getStructErrorMessage.js';

// Express 글로벌 에러 핸들러
export default (err, req, res, next) => {
  // 개발 환경일 때만 전체 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  } else {
    console.error('🔴', err.message);
  }

  // 이미 한글화된 메시지가 err.message에 있으면 그대로 사용
  if (typeof err.message === 'string' && err.message.endsWith('니다')) {
    return res.status(err.status || 400).json({
      success: false,
      message: err.message,
    });
  }

  // superstruct StructError만 한글화해서 응답
  if (err instanceof StructError) {
    return res.status(400).json({
      success: false,
      message: getStructErrorMessage(err),
      path: err.path,
    });
  }

  // Prisma 제약조건 위반 처리
  if (err.name === 'PrismaClientKnownRequestError') {
    // unique
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: '이미 존재하는 값이 입력되었습니다.',
        ...(process.env.NODE_ENV === 'development' && { target: err.meta?.target }),
      });
    }
    //P2025 에러 해당하는 ID값이 없을 떄 발생
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: '해당하는 ID값이 없습니다.',
        ...(process.env.NODE_ENV === 'development' && { target: err.meta?.target }),
      });
    }
    // Prisma 기타 에러
    return res.status(400).json({
      success: false,
      message: '데이터베이스 처리 중 오류가 발생했습니다.',
      ...(process.env.NODE_ENV === 'development' && { code: err.code, detail: err.meta }),
    });
  }

  // 기타 에러
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};