import * as struct from 'superstruct'
import fs from 'fs/promises';

const createRecord = struct.object({
  exerciseType: struct.enums(['RUN', 'BIKE', 'SWIM']),
  description: struct.optional(struct.size(struct.string(), 0, 500)),
  time: struct.refine(struct.integer(), 'timeLimit', (value) => {
    return value > 0 && value <= (3600 * 1000 * 10)
  }),
  distance: struct.refine(struct.number(), 'distanceLimit', (value) => {
    return value > 0 && value <= 1000
  }),
  authorNickname: struct.string(),
  authorPassword: struct.string(),
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

export const validateCreateRecord = async (req, res, next) => {
  const [error] = struct.validate(req.body, createRecord);

  if (error) {
    for (const file of req.files) {
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        console.error('파일 삭제 실패:', unlinkError);
      }
    }
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
}; */