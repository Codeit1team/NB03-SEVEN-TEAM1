import { PrismaClient } from '@prisma/client';
import RecordService from "#services/RecordService.js";
import sendDiscordWebhook from "#utils/sendDiscordWebhook.js";
import deleteUploadedFiles from '#utils/deleteUploadedFiles.js';

const prisma = new PrismaClient();

const createRecord = async (req, res, next) => {
  try {
    req.body.photos = req.files.map(file => `http://localhost:3000/uploads/${file.filename}`);
    const record = await RecordService.createRecord(req.body);
    const groupId = req.params.id;
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { webhookUrl: true },
    });
    if (group.webhookUrl) {
      await sendDiscordWebhook(group.webhookUrl, `${req.body.authorNickname} 운동기록 등록이 완료되었습니다`);
    }
    return res.status(201).json(record);
  } catch (error) {
    await deleteUploadedFiles(req.files);
    error.status = 400;
    error.message = '기록 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try{
    const groupId = req.params.id;
    const { page, limit, order, orderBy, search } = req.query;
    const records = await RecordService.getRecords(groupId, page, limit, order, orderBy, search);
    res.json(records);
  } catch (error) {
    error.status = 500;
    error.message = "그룹의 기록 목록을 가져오는 데 실패했습니다"
  }
};

const getRecordDetail = async (req, res, next) => {
  try {
    const recordId = req.params.id
    const record = await RecordService.getRecordDetail(recordId)
    return res.status(200).json(record)
  } catch (error) {
    console.log(error)
    error.status = 404;
    error.message = '기록 조회에 실패했습니다. 해당하는 기록이 없습니다.';
    next(error);
  }
};

export default {
  createRecord,
  getRecords,
  getRecordDetail
};