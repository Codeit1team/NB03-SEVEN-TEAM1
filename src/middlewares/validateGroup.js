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
  // multipart/form-data에서 tags, goalRep 필드가 문자열로 전송된 경우 JSON 파싱
  if (req.body.tags && typeof req.body.tags === 'string') {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (error) {
      if (req.files) { await deleteUploadedFiles(req.files); }
      return res.status(400).json({ message: 'tags 필드가 유효하지 않습니다' });
    }
  }

  if (req.body.goalRep && typeof req.body.goalRep === 'string') {
    const goalRep = parseInt(req.body.goalRep, 10);
    if (isNaN(goalRep)) {
      if (req.files) { await deleteUploadedFiles(req.files); }
      return res.status(400).json({ message: 'goalRep 필드가 유효하지 않습니다' });
    }
    req.body.goalRep = goalRep;
  }

  // photoUrl이 파일 업로드인 경우 검증에서 제외
  const hasPhotoFile = req.files && req.files.photoUrl && req.files.photoUrl[0];

  // photoUrl이 파일 업로드인 경우 임시로 제거하여 검증 우회
  let bodyForValidation = { ...req.body };
  if (hasPhotoFile) {
    delete bodyForValidation.photoUrl;
  }

  const [error] = struct.validate(bodyForValidation, createGroup);

  if (error) {
    if (req.files) { await deleteUploadedFiles(req.files); }
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
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