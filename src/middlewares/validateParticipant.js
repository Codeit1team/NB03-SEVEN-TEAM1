import * as struct from 'superstruct'

export const createParticipant = struct.object({
  nickname: struct.size(struct.string(), 1, 20),
  password: struct.size(struct.string(), 4, 20),
});

export const validateCreateParticipant = (req, res, next) => {
  const [error] = struct.validate(req.body, createParticipant);

  if (error) {
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};