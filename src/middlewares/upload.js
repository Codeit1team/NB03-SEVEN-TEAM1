import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 이미지 업로드 미들웨어를 생성합니다.
 *
 * @param {Object} options
 * @param {number} [options.maxCount=5] - photos 필드의 최대 업로드 개수
 * @returns {Function[]} Express 미들웨어 배열
 *
 * @example
 * // 여러 장 업로드 (필드명: photos)
 * import uploadImages from '#middlewares/upload.js';
 *
 * router.post(
 *   '/:groupId/records',
 *   uploadImages({ maxCount: 5 }),
 *   RecordController.createRecord
 * );
 *
 * @example
 * // 단일 업로드 (필드명: photoUrl)
 * import uploadImages from '#middlewares/upload.js';
 *
 * router.post(
 *   '/groups',
 *   uploadImages({ maxCount: 1 }),
 *   GroupController.createGroup
 * );
 */
const uploadImages = ({ maxCount = 5 } = {}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads/temp'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const safeBase = Buffer.from(base, 'utf8').toString('hex');
      const uuid = crypto.randomUUID();
      cb(null, `${safeBase}-${uuid}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
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
      fileSize: 1 * 1024 * 1024,
    },
  }).fields([
    { name: 'photos', maxCount },
    { name: 'photoUrl', maxCount: 1 },
  ]);

  return [
    (req, res, next) => {
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('multipart/form-data')) {
        return next();
      }

      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          let message = '파일 업로드 오류입니다.';

          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              message = '각 파일 용량은 1MB 이하만 첨부 가능합니다.';
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

export default uploadImages;