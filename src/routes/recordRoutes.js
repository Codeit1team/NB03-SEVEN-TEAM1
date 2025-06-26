import { Router } from 'express';
import { validateCreateRecord, validatePatchRecord } from '#middlewares/validateRecord';
import { uploadImages } from '#middlewares/upload';
import RecordController from '#controllers/recordController';

const RecordRouter = Router();

RecordRouter.route(':id')
  .post(uploadImages(),validateCreateRecord,RecordController.createRecord)
