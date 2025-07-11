export default function handleServerError(error, message) {
  console.error('🔴 서버 처리 중 예외 발생:', error);

  if (!error.status) {
    error.status = 500;
  }

  if (!error.message) {
    error.message = message || '서버 내부 오류가 발생했습니다.';
  }

  return error;
}