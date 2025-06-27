import { Router } from 'express';
// import { validateCreateRecord, validatePatchRecord } from '#middlewares/validateRecord.js';
import { uploadImages } from '#middlewares/upload.js';
import RecordController from '#controllers/recordController.js';

const RecordRouter = Router();

RecordRouter.route('/:id')
  // .post(uploadImages(),validateCreateRecord,RecordController.createRecord)
  .get(RecordController.getRecordDetail)

export default RecordRouter