import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

/**
 * 주어진 평문 비밀번호를 bcrypt로 해싱해서 반환합니다.
 * @param {string} plainPassword - 사용자가 입력한 비밀번호(평문)
 * @returns {Promise<string>} - 해싱된 비밀번호(저장용)
 */
export const hashPassword = async (plainPassword) => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (err) {
    throw new Error('비밀번호 해싱 중 오류 발생');
  }
};

/**
 * 평문 비밀번호와 해시된 비밀번호가 일치하는지 확인합니다.
 * @param {string} plainPassword - 사용자가 입력한 비밀번호(평문)
 * @param {string} hashedPassword - DB에 저장된 해시된 비밀번호
 * @returns {Promise<boolean>} - 일치하면 true, 불일치하면 false
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    throw new Error('비밀번호 비교 중 오류 발생');
  }
};

// 각 에러 catch(err) 아래에 필요시 로깅 추가

/* 
사용 예시
import { hashPassword, comparePassword } from './utils/passwordUtil.js';

const hashed = await hashPassword('1234');
const isValid = await comparePassword('입력', hashed);
 */