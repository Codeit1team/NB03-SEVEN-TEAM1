import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 이미지 업로드 미들웨어를 생성합니다.
 *
 * @param {Object} options - 업로드 옵션
 * @param {number} options.maxCount - 최대 업로드 이미지 수
 * @returns {multer.Multer} multer 미들웨어 (Express에서 사용)
 *
 * @example
 * import { uploadImages } from '../middlewares/upload.js';
 *
 * router.post(
 *   '/:groupId/records',
 *   uploadImages({ maxCount: 5 }), // 최대 5장 업로드 허용
 *   RecordController.createRecord
 * );
 */
export const uploadImages = ({ maxCount = 5 } = {}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const unique = Date.now();
      cb(null, `${base}-${unique}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', '허용되지 않는 파일 형식입니다.'));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 1 * 1024 * 1024, // 1MB 제한
    },
  }).array('photos', maxCount);
};