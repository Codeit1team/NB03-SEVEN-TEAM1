import { PrismaClient } from '@prisma/client';
import RecordService from "#services/RecordService.js";
import sendDiscordWebhook from "#utils/sendDiscordWebhook.js";

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

export default {
  createRecord
}