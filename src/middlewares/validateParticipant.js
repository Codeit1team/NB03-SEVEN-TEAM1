import * as struct from 'superstruct'

export const createParticipant = struct.object({
  nickname: struct.size(struct.string(), 1, 20),
  password: struct.size(struct.string(), 4, 20),
});

const validateCreateParticipant = (req, res, next) => {
  const [error] = struct.validate(req.body, createParticipant);

  if (error) {
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};

const validateIdParam = (paramName, label = paramName) => {
  return (req, res, next) => {
    const id = parseInt(req.params[paramName]);
    if (isNaN(id)) {
      return res.status(400).json({ message: `${label}가 숫자가 아닙니다.` });
    }
    req.params[paramName] = id; // 문자열 → 숫자로 덮어쓰기
    next();
  };
};

export default {
  validateCreateParticipant,
  validateIdParam
}