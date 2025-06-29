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
 * @returns {Function[]} - Express용 미들웨어 배열
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
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 1 * 1024 * 1024, // 1MB 제한
      files: maxCount,
    },
  }).array('photos', maxCount);

  return [
    (req, res, next) => {
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          let message = '파일 업로드 오류입니다.';

          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              message = '파일 용량은 1MB 이하만 가능합니다.';
              break;
            case 'LIMIT_FILE_COUNT':
              message = '최대 업로드 개수를 초과했습니다.';
              break;
            case 'LIMIT_UNEXPECTED_FILE':
              message = '허용되지 않는 파일 형식입니다.';
              break;
          }

          return res.status(400).json({ success: false, message });
        }

        if (err) {
          return res.status(500).json({
            success: false,
            message: '파일 업로드 중 서버 오류가 발생했습니다.',
          });
        }

        next();
      });
    },
  ];
};