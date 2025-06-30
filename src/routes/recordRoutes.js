import { Router } from 'express';
import { uploadImages } from '#middlewares/upload.js';
import validateCreateRecord from '#middlewares/validateRecord.js';
import getUser from '#middlewares/getUser.js';
import RecordController from '#controllers/recordController.js';

const RecordRouter = Router();

RecordRouter.route('/:id')
  .post(uploadImages(), validateCreateRecord, getUser, RecordController.createRecord)

export default RecordRouter;
