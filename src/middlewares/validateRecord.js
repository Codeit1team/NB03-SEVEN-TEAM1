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

//  postman 테스트 코드 포스트맨은 int,float 값 보낼수없이 전부 string이라 테스트코드변경
/*const timeStruct = struct.refine(
  struct.coerce(struct.integer(), struct.string(), (value) => parseInt(value, 10)),
  'timeLimit',
  (value) => value > 0 && value <= (3600 * 1000 * 10)
);

const distanceStruct = struct.refine(
  struct.coerce(struct.number(), struct.string(), (value) => parseFloat(value)),
  'distanceLimit',
  (value) => value > 0 && value <= 1000
);

const createRecord = struct.object({
  exerciseType: struct.enums(['RUN', 'BIKE', 'SWIM']),
  description: struct.optional(struct.size(struct.string(), 0, 500)),
  time: timeStruct,
  distance: distanceStruct,
  authorNickname: struct.string(),
  authorPassword: struct.string(),
});*/

const validateCreateRecord = async (req, res, next) => {
  const [error] = struct.validate(req.body, createRecord);

  if (error) {
    await deleteUploadedFiles(req.files);
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};

// postman 테스트 코드
/*export const validateCreateRecord = async (req, res, next) => {
  try {
    const validated = struct.create(req.body, createRecord);
    req.body = validated; 
    next();
  } catch (error) {
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('파일 삭제 실패:', unlinkError);
        }
      }
    }
    const field = error.path?.[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다`: '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
};*/ 

const validateGetRecords = (req, res, next) => {
  const { page = '1', limit = '10', order = 'createdAt', orderBy = 'desc', duration = 'weekly'} = req.query;

  const intPage = parseInt(page, 10);
  const intLimit = parseInt(limit, 10);

  if (isNaN(intPage) || intPage < 1) {
    return res.status(400).json({ error: 'page는 1 이상의 숫자여야 합니다.' });
  }

  if (isNaN(intLimit) || intLimit < 1 || intLimit > 50) {
    return res.status(400).json({ error: 'limit은 1~50 사이 숫자여야 합니다.' });
  }

  const allowedOrderFields = ['createdAt', 'time'];
  if (!allowedOrderFields.includes(order)) {
    return res.status(400).json({ error: `order는 ${allowedOrderFields.join(', ')} 중 하나여야 합니다.` });
  }

  const allowedOrderBy = ['asc', 'desc'];
  if (!allowedOrderBy.includes(orderBy)) {
    return res.status(400).json({ error: 'orderby는 asc 또는 desc만 가능합니다.' });
  }

  const allowedDuration = ['weekly', 'monthly'];
  if (!allowedDuration.includes(duration)) {
    return res.status(400).json({error: 'duration은 weekly, monthly만 가능합니다'});
  }

  next();
};

export default {
  validateCreateRecord,
  validateGetRecords
}