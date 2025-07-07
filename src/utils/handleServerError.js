export default function handleServerError(error, message) {
  if (!error.status) {
    error.status = 500;
    error.message = message || '서버 내부 오류가 발생했습니다.';
  }
  return error;
}