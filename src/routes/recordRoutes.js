import { Router } from 'express';
import validateRecord from '#middlewares/validateRecord.js';
import getUser from '#middlewares/getUser.js';
import RecordController from '#controllers/recordController.js';

const RecordRouter = Router();

RecordRouter.route('/:groupId')
  .get(validateRecord.validateIdParam('groupId','그룹아이디'), validateRecord.validateGetRecords, RecordController.getRecords)
  .post(validateRecord.validateIdParam('groupId','그룹아이디'), validateRecord.validateCreateRecord, getUser, RecordController.createRecord)

RecordRouter.route('/detail/:recordId')
  .get(validateRecord.validateIdParam('recordId','기록아이디'), RecordController.getRecordDetail)

RecordRouter.route('/ranking/:groupId')
  .get(validateRecord.validateIdParam('groupId','그룹아이디'), validateRecord.validateGetRecords, RecordController.getRanks)

export default RecordRouter