import { Router } from 'express';
import { uploadImages } from '#middlewares/upload.js';
import validateRecord from '#middlewares/validateRecord.js';
import getUser from '#middlewares/getUser.js';
import RecordController from '#controllers/recordController.js';

const RecordRouter = Router();

RecordRouter.route('/:groupId')
  .get(validateRecord.validateGetRecords, RecordController.getRecords)
  .post(uploadImages(), validateRecord.validateCreateRecord, getUser, RecordController.createRecord)

RecordRouter.route('/detail/:recordId')
  .get(RecordController.getRecordDetail)

RecordRouter.route('/ranking/:groupId')
  .get(validateRecord.validateGetRecords, RecordController.getRanks)

export default RecordRouter