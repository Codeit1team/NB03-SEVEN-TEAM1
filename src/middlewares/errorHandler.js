import { StructError } from 'superstruct';

// Express 글로벌 에러 핸들러
export default (err, req, res, next) => {
  // 개발 환경일 때만 전체 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  } else {
    console.error('🔴', err.message);
  }

  // superstruct 유효성 검사 실패 처리
  if (err instanceof StructError) {
    return res.status(400).json({
      success: false,
      message: err.message,
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
    // Prisma 기타 에러
    return res.status(400).json({
      success: false,
      message: '데이터베이스 처리 중 오류가 발생했습니다.',
      ...(process.env.NODE_ENV === 'development' && { code: err.code, detail: err.meta }),
    });
  }

  // 기타 에러
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};