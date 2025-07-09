import * as struct from 'superstruct'

const Url = struct.refine(struct.string(), 'URL', value => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
})

const VALIDATION_RECORD_ERRORS = {
  exerciseType: '운동 타입이 올바르지 않습니다',
  description: '기록 설명은 500자 이하여야 합니다',
  time: '시간이 잘못 등록되었습니다',
  distance: '거리가 잘못 등록되었습니다',
  authorNickname: '닉네임이 너무 길거나 올바르지 않습니다',
  authorPassword: '비밀번호는 4자 이상 20자 이하로 입력해주세요',
  photos: '사진 정보가 잘못되었습니다'
}

const createRecord = struct.object({
  exerciseType: struct.enums(['run', 'bike', 'swim']),
  description: struct.optional(struct.size(struct.string(), 0, 500)),
  time: struct.refine(struct.integer(), 'timeLimit', (value) => {
    return value > 0 && value <= (3600 * 1000 * 10)
  }),
  distance: struct.refine(struct.number(), 'distanceLimit', (value) => {
    return value > 0 && value <= 1000
  }),
  authorNickname: struct.refine(struct.size(struct.string(), 1, 20), 'NoSpecialChars', (value) => {
    const specialCharRegex = /[^가-힣a-zA-Z0-9\s]/;
    return !specialCharRegex.test(value);
  }),
  authorPassword: struct.size(struct.string(), 4, 20),
  photos: struct.optional(struct.array(Url))
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
    const field = error.path?.[0];
    const message = field ? VALIDATION_RECORD_ERRORS[field] : '데이터가 잘못되었습니다';
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

const validateIdParam = (paramName, label = paramName) => {
  return (req, res, next) => {
    const id = parseInt(req.params[paramName]);
    if (isNaN(id)) {
      return res.status(400).json({ message: `${label}가 없거나 숫자가 아닙니다.` });
    }
    req.params[paramName] = id; 
    next();
  };
};

export default {
  validateCreateRecord,
  validateGetRecords,
  validateIdParam
}