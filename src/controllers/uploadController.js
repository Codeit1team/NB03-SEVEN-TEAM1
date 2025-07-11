import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';

/**
 * 업로드된 이미지 파일의 실제 MIME 타입을 검사하고,
 * 유효하지 않은 파일은 삭제 후 오류 응답을 반환합니다.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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

  // 파일 유효성 검사
  const invalidFiles = [];

  for (const file of files) {
    const fileType = await fileTypeFromFile(file.path);
    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      invalidFiles.push(file);
    }
  }

  if (invalidFiles.length > 0) {
    await Promise.all(
      files.map(file => fs.unlink(file.path).catch(() => {}))
    );
    return res.status(400).json({
      success: false,
      message: '허용되지 않는 파일이 포함되어 있어 업로드가 거부되었습니다.',
    });
  }

  const BASE_URL = req.app.locals.BASE_URL;
  const urls = files.map(file => `${BASE_URL}/api/files/temp/${file.filename}`);

  return res.json({ success: true, urls });
};

export default { uploadImage };