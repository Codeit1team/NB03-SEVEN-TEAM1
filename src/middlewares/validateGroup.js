import * as struct from 'superstruct'
import deleteUploadedFiles from '#utils/deleteUploadedFiles.js';

const Url = struct.refine(struct.string(), 'URL', value => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
})

export const createGroup = struct.object({
  name: struct.size(struct.string(), 1, 20),
  description: struct.optional(struct.size(struct.string(), 0, 500)),
  photoUrl: struct.optional(Url),
  goalRep: struct.refine(struct.integer(), 'PositiveInt', (value) => value >= 0),
  discordWebhookUrl: struct.optional(Url),
  discordInviteUrl: struct.optional(Url),

  tags: struct.optional(struct.array(struct.size(struct.string(), 1, 20))),

  ownerNickname: struct.size(struct.string(), 1, 20),
  ownerPassword: struct.size(struct.string(), 4, 20),
});

export const patchGroup = struct.partial(createGroup);

export const validateCreateGroup = async (req, res, next) => {
  try {
    // multipart/form-data에서 tags, goalRep 필드가 문자열로 전송된 경우 JSON 파싱
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = JSON.parse(req.body.tags);
    }

    if (req.body.goalRep && typeof req.body.goalRep === 'string') {
      req.body.goalRep = parseInt(req.body.goalRep, 10);
    }

    const [error] = struct.validate(req.body, createGroup);

    if (error) {
      const field = error.path[0];
      const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
      throw new Error(message);
    }
    
    next();
  } catch (err) {
    // 에러 발생 시 업로드된 파일 삭제 (multipart/form-data인 경우에만)
    if (req.files?.photoUrl?.[0]) { 
      await deleteUploadedFiles(req.files.photoUrl); 
    }
    
    const statusCode = err.message.includes('유효하지 않습니다') ? 400 : 500;
    const message = statusCode === 500 ? '서버 오류가 발생했습니다' : err.message;
    
    if (statusCode === 500) {
      console.error('validateCreateGroup 오류:', err);
    }
    
    return res.status(statusCode).json({ message });
  }
};

export const validatePatchGroup = (req, res, next) => {
  const [error] = struct.validate(req.body, patchGroup);

  if (error) {
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};

const validateGetGroups = (req, res, next) => {
  const { page = 1, limit = 10, order = 'createdAt', orderBy = 'desc', duration = 'weekly' } = req.query;

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

  next();
};

export default {
  validateCreateGroup,
  validatePatchGroup,
  validateGetGroups
}