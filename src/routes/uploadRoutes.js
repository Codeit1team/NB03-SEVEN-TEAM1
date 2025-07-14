import { Router } from 'express';
import uploadImages from '#middlewares/upload.js';
import uploadController from '#controllers/uploadController.js';

const router = Router();

router.post(
  '/',
  uploadImages({ maxCount: 5 }),
  uploadController.uploadImage
);

export default router;