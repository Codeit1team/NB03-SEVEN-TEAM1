import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';

/**
 * upload 미들웨어에서 이미 서버에 저장된 이미지 파일들에 대해
 * 실제 이미지 포맷 여부를 검증하고, 비정상 파일을 삭제합니다.
 * 
 * 1. 업로드된 파일이 없으면 400 반환
 * 2. 각 파일에 대해 file-type으로 실제 이미지 포맷 여부를 검증합니다.
 *    - 허용된 이미지 포맷이 아닌 경우 즉시 삭제 및 정상 파일만 남김
 * 3. 모든 파일이 정상 이미지면 파일 URL 반환
 * 비정상 파일이 있으면 전체 파일 삭제 후 400 반환
 * 
 * @param {import('express').Request} req - Express 요청 객체
 * @param {import('express').Response} res - Express 응답 객체
 * @returns {Promise<void>}
 */
const uploadImage = async (req, res) => {
  const files = [
    ...(req.files?.photos || []),
    ...(req.files?.photoUrl || []),
  ];

  if (files.length === 0) {
    return res.status(400).json({
      success: false,
      message: '업로드된 파일이 없습니다.',
    });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  let allValid = true;

  for (const file of files) {
    const fileType = await fileTypeFromFile(file.path);
    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      allValid = false;
      break;
    }
  }

  if (!allValid) {
    for (const file of files) {
      await fs.unlink(file.path).catch(() => {});
    }
    return res.status(400).json({
      success: false,
      message: '허용되지 않는 파일이 포함되어 있어 업로드가 거부되었습니다.',
    });
  }

  const BASE_URL = req.app.locals.BASE_URL;
  const urls = files.map(file => `${BASE_URL}/api/files/${file.filename}`);

  return res.json({ success: true, urls });
};

export default { uploadImage };