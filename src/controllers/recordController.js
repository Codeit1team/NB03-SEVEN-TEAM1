import { PrismaClient } from '@prisma/client';
import RecordService from "#services/RecordService.js";
import { sendDiscordWebhook } from "#utils/sendDiscordWebhook.js";
import deleteUploadedFiles from '#utils/deleteUploadedFiles.js';
import { grantRecord100Badge } from '#utils/grantGroupBadge.js';
import handleServerError from '#utils/handleServerError.js';

const prisma = new PrismaClient();

const createRecord = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const PORT = process.env.PORT || 3001
    req.body.photos = req.files.photos.map(file => `http://localhost:${PORT}/uploads/${file.filename}`);
    const record = await RecordService.createRecord(groupId, req.body);
    await grantRecord100Badge(groupId)
    // const group = await prisma.group.findUnique({
    //   where: { id: groupId },
    //   select: { webhookUrl: true },
    // });
    // if (group.webhookUrl) {
    //   await sendDiscordWebhook(group.webhookUrl, `${req.body.authorNickname} 운동기록 등록이 완료되었습니다`);
    // }
    return res.status(201).json(record);
  } catch (error) {
    if (req.files.photos) await deleteUploadedFiles(req.files.photos);
    next(handleServerError(error, '서버 내부 오류로 기록 생성에 실패했습니다.'));
  }
};

const getRecords = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const { page, limit, order, orderBy, search } = req.query;
    const records = await RecordService.getRecords(groupId, page, limit, order, orderBy, search);
    return res.json(records);
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 기록 목록 조회에 실패했습니다.'));
  }
};

const getRecordDetail = async (req, res, next) => {
  try {
    const recordId = req.params.recordId
    const record = await RecordService.getRecordDetail(recordId)
    return res.status(200).json(record)
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 기록 조회에 실패했습니다.'));
  }
};

const getRanks = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const { page, limit, duration } = req.query;
    const recordsRanking = await RecordService.getRanks(groupId, page, limit, duration);
    return res.json(recordsRanking)
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 그룹의 랭킹을 가져오는 데 실패했습니다'));
  }
};

export default {
  createRecord,
  getRecords,
  getRanks,
  getRecordDetail
}