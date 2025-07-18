import * as struct from 'superstruct'

const VALIDATION_GROUP_ERRORS = {
  name: '그룹명은 20자 이하로 특수문자를 포함하면 안됩니다',
  description: '그룹 설명은 500자 이하여야 합니다',
  photoUrl: '사진 정보가 잘못되었습니다',
  goalRep: '목표횟수가 너무 많거나 잘못 등록되었습니다',
  discordWebhookUrl: 'discordWebhookUrl은 url형태로 등록되어야 합니다',
  discordInviteUrl: 'discordInviteUrl은 url형태로 등록되어야 합니다',
  authorPassword: '비밀번호는 4자 이상 20자 이하로 입력해주세요',
  tags: '태그는 문자열 20자 이하여야 합니다',
  ownerNickname: '그룹장 이름은 20자이하로 특수문자를 포함하면 안됩니다',
  ownerPassword: '그룹장 비밀번호는 4자이상 20자 이하여야 합니다',
  ownerId: '그룹장 ID가 정확하지 않습니다'
}

const Url = struct.refine(struct.string(), 'URL', value => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
})
const NullableUrl = struct.union([Url, struct.literal(null)]);

const groupFields = {
  name: struct.refine(struct.size(struct.string(), 1, 20), 'NoSpecialChars', (value) => {
    const specialCharRegex = /[^가-힣a-zA-Z0-9\s]/;
    return !specialCharRegex.test(value);
  }),
  description: struct.optional(struct.size(struct.string(), 0, 500)),
  photoUrl: struct.optional(NullableUrl),
  goalRep: struct.refine(struct.integer(), 'PositiveInt', (value) => value >= 0 && 100000000 >= value),
  discordWebhookUrl: struct.optional(Url),
  discordInviteUrl: struct.optional(Url),
  tags: struct.optional(struct.array(struct.size(struct.string(), 1, 20))),
  ownerNickname: struct.refine(struct.size(struct.string(), 1, 20), 'NoSpecialChars', (value) => {
    const specialCharRegex = /[^가-힣a-zA-Z0-9\s]/;
    return !specialCharRegex.test(value);
  }),
  ownerPassword: struct.size(struct.string(), 4, 20),
}
const createGroup = struct.object({
  ...groupFields
});

const patchGroup = struct.object({
  ...groupFields,
  ownerId: struct.number(),
});

const validateCreateGroup = async (req, res, next) => {
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
      const message = field ? VALIDATION_GROUP_ERRORS[field] : '데이터가 잘못되었습니다';
      return res.status(400).json({ message });
    }
    next();
};

const validatePatchGroup = (req, res, next) => {
  const [error] = struct.validate(req.body, patchGroup);

  if (error) {
    const field = error.path[0];
    const message = field ? VALIDATION_GROUP_ERRORS[field] : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};

const validateGetGroups = (req, res, next) => {
  const { page = 1, limit = 10, order = 'desc', orderBy = 'createAt' } = req.query;

  const intPage = parseInt(page, 10);
  const intLimit = parseInt(limit, 10);

  if (isNaN(intPage) || intPage < 1) {
    return res.status(400).json({ error: 'page는 1 이상의 숫자여야 합니다.' });
  }

  if (isNaN(intLimit) || intLimit < 1 || intLimit > 50) {
    return res.status(400).json({ error: 'limit은 1~50 사이 숫자여야 합니다.' });
  }

  const allowedOrderFields = ['asc', 'desc'];
  if (!allowedOrderFields.includes(order)) {
    return res.status(400).json({ error: 'order는 asc 또는 desc만 가능합니다.' });
  }

  const allowedOrderBy = ['likeCount', 'participantCount', 'createdAt'];
  if (!allowedOrderBy.includes(orderBy)) {
    return res.status(400).json({ error: `orderBy는 ${allowedOrderFields.join(', ')} 중 하나여야 합니다.` });
  }

  next();
};

const validateIdParam = (paramName, label = paramName) => {
  return (req, res, next) => {
    const id = parseInt(req.params[paramName]);
    if (isNaN(id)) {
      return res.status(400).json({ message: `${label}가 숫자가 아닙니다.` });
    }
    req.params[paramName] = id;
    next();
  };
};

export default {
  validateCreateGroup,
  validatePatchGroup,
  validateGetGroups,
  validateIdParam
}