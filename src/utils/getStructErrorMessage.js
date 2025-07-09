/**
 * Superstruct의 유효성 검사(StructError)에서 발생한 에러를 한글 메시지로 변환합니다.
 *
 * @param {import('superstruct').StructError} error - Superstruct에서 발생한 StructError 객체
 * @returns {string} - 한글로 변환된 에러 메시지
 *
 * @example
 * import { StructError } from 'superstruct';
 * import getStructErrorMessage from '#utils/getStructErrorMessage.js';
 *
 * try {
 *   // ...superstruct 유효성 검사 로직
 * } catch (err) {
 *   if (err instanceof StructError) {
 *     const message = getStructErrorMessage(err);
 *     // 예: "photoUrl 항목은 문자열이어야 합니다."
 *   }
 * }
 */
const getStructErrorMessage = (error) => {
  const field = error.path && error.path.length > 0 ? error.path.join('.') : null;
  const type = error.type;

  switch (type) {
    case 'string':
      return field ? `"${field}" 항목은 문자열이어야 합니다.` : '문자열 타입 오류입니다.';
    case 'URL':
      return field ? `"${field}" 항목은 올바른 URL 형식이어야 합니다.` : 'URL 형식이 올바르지 않습니다.';
    case 'integer':
      return field ? `"${field}" 항목은 정수여야 합니다.` : '정수 타입 오류입니다.';
    case 'PositiveInt':
      return field ? `"${field}" 항목은 0 이상의 숫자여야 합니다.` : '양수여야 합니다.';
    case 'NoSpecialChars':
      return field ? `"${field}" 항목에는 특수문자가 들어갈 수 없습니다.` : '특수문자 제한 오류입니다.';
    case 'array':
      return field ? `"${field}" 항목은 배열이어야 합니다.` : '배열 타입 오류입니다.';
    default:
      return field
        ? `"${field}" 항목에 잘못된 값이 입력되었습니다.`
        : '입력 데이터가 유효하지 않습니다.';
  }
};

export default getStructErrorMessage;