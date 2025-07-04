import * as struct from 'superstruct'
import deleteUploadedFiles from '#utils/deleteUploadedFiles.js';

const createRecord = struct.object({
  exerciseType: struct.enums(['RUN', 'BIKE', 'SWIM']),
  description: struct.optional(struct.size(struct.string(), 0, 500)),
  time: struct.refine(struct.integer(), 'timeLimit', (value) => {
    return value > 0 && value <= (3600 * 1000 * 10)
  }),
  distance: struct.refine(struct.number(), 'distanceLimit', (value) => {
    return value > 0 && value <= 1000
  }),
  authorNickname: struct.size(struct.string(), 1, 20),
  authorPassword: struct.size(struct.string(), 4, 20)
});

const validateCreateRecord = async (req, res, next) => {
  if (req.body.time && typeof req.body.time === 'string') {
    req.body.time = parseInt(req.body.time)
  }

  if (req.body.distance && typeof req.body.distance === 'string') {
    req.body.distance = Number(req.body.distance)
  }

  const [error] = struct.validate(req.body, createRecord);

  if (error) {
    await deleteUploadedFiles(req.files.photos);
    const field = error.path?.[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};

const validateGetRecords = (req, res, next) => {
  const { page = 1, limit = 10, orderBy = 'createdAt', order = 'desc', duration = 'weekly' } = req.query;

  const intPage = parseInt(page, 10);
  const intLimit = parseInt(limit, 10);

  if (isNaN(intPage) || intPage < 1) {
    return res.status(400).json({ error: 'page는 1 이상의 숫자여야 합니다.' });
  }

  if (isNaN(intLimit) || intLimit < 1 || intLimit > 50) {
    return res.status(400).json({ error: 'limit은 1~50 사이 숫자여야 합니다.' });
  }

  const allowedOrderByFields = ['createdAt', 'time'];
  if (!allowedOrderByFields.includes(orderBy)) {
    return res.status(400).json({ error: `orderBy는 ${allowedOrderByFields.join(', ')} 중 하나여야 합니다.` });
  }

  const allowedOrder = ['asc', 'desc'];
  if (!allowedOrder.includes(order)) {
    return res.status(400).json({ error: 'order는 asc 또는 desc만 가능합니다.' });
  }

  const allowedDuration = ['weekly', 'monthly'];
  if (!allowedDuration.includes(duration)) {
    return res.status(400).json({ error: 'duration은 weekly, monthly만 가능합니다' });
  }

  next();
};

export default {
  validateCreateRecord,
  validateGetRecords
}