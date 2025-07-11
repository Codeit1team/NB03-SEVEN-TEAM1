import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.BASE_URL
  : `${process.env.BASE_URL_DEV}:${process.env.PORT || 3001}`;

/**
 * 임시 업로드 파일을 uploads/로 이동시킨 후 접근 가능한 URL을 반환합니다.
 *
 * @param {string} tempUrl - /uploads/temp/파일명 또는 /api/files/temp/파일명 등
 * @returns {Promise<string>} - 이동 후 /api/files/파일명 형태의 URL
 */
export const moveTempToPermanent = async (tempUrl) => {
  const filename = path.basename(tempUrl);
  const fromPath = path.join(__dirname, '../../uploads/temp', filename);
  const toDir = path.join(__dirname, '../../uploads');
  const toPath = path.join(toDir, filename);

  await fs.mkdir(toDir, { recursive: true });

  try {
    await fs.rename(fromPath, toPath);
  } catch (err) {
    console.error(`[moveTempToPermanent]`, err.message);
    throw err;
  }

  return `${BASE_URL}/api/files/${filename}`;
};

/**
 * 주어진 이미지 URL에서 파일명만 추출해 uploads/ 폴더에서 해당 파일을 삭제합니다.
 *
 * @param {string} url - 이미지 접근 URL 또는 경로 (예: /api/files/파일명, /uploads/파일명, https://도메인/api/files/파일명 등)
 * @returns {Promise<void>}
 *
 * @example
 * // 그룹 삭제 시
 * await deleteUploadedFile('/api/files/파일명.png');
 *
 * // 절대경로나 도메인 포함 URL도 처리 가능
 * await deleteUploadedFile('https://seven.mimu.live/api/files/파일명.png');
 */
export const deleteUploadedFile = async (url) => {
  if (!url) return;
  const filename = path.basename(url); // 파일명만 추출
  const filepath = path.join(__dirname, '../../uploads', filename);

  try {
    await fs.unlink(filepath);
    console.log(`[파일 삭제됨] ${filepath}`);
  } catch (err) {
    // 파일이 없을 경우는 무시, 다른 에러는 로깅
    if (err.code === 'ENOENT') {
    } else {
      console.warn(`[deleteUploadedFile] ${filepath}:`, err.message);
    }
  }
};