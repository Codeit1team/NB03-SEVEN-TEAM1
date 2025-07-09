import { fromFile } from 'file-type';
import fs from 'fs/promises';

/**
 * 여러 이미지 파일 업로드를 처리합니다.
 * 
 * 1. 업로드된 파일이 없으면 400 반환
 * 2. 업로드된 각 파일에 대해 file-type으로 실제 이미지 포맷 여부를 검증합니다.
 *    - 허용된 이미지 포맷이 아닌 경우 즉시 삭제 및 업로드 전체 거부
 * 3. 모든 파일이 정상 이미지일 경우 업로드 URL을 반환합니다.
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

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const invalidFiles = [];

  for (const file of files) {
    const fileType = await fromFile(file.path);
    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      await fs.unlink(file.path).catch(() => {});
      invalidFiles.push(file.originalname);
    }
  }

  if (invalidFiles.length > 0) {
    return res.status(400).json({
      success: false,
      message: `지원하지 않는 이미지 형식입니다: ${invalidFiles.join(', ')}`,
    });
  }

  const BASE_URL = req.app.locals.BASE_URL;
  const urls = files.map(file => `${BASE_URL}/api/files/${file.filename}`);

  return res.json({ success: true, urls });
};

export default { uploadImage };