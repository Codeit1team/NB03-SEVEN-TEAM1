import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

/**
 * 주어진 평문 비밀번호를 bcrypt로 해싱해서 반환합니다.
 * @param {string} plainPassword
 * @returns {Promise<string|false>} - 실패 시 false
 */
const hashPassword = async (plainPassword) => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    console.error('❌ 비밀번호 해싱 중 오류:', error);
    return false;
  }
};

/**
 * 평문 비밀번호와 해시가 일치하는지 확인합니다.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>} - 실패 시 false
 */
const isPasswordValid = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('❌ 비밀번호 비교 중 오류:', error);
    return false;
  }
};

export { hashPassword, isPasswordValid };