import * as struct from 'superstruct'

const createRecord = struct.object({
  exerciseType: struct.enums(['RUN', 'BIKE', 'SWIM']),
  description: struct.optional(struct.size(struct.string(), 0, 500)),
  time: struct.refine(integer(), 'timeLimit', (value) => {
    return value > 0 && value <= (3600 * 1000 * 10)
  }),
  distance: struct.refine(struct.number(), 'distanceLimit', (value) => {
    return value > 0 && value <= 1000
  }),
  authorId: struct.number(),
});

export const validateCreateRecord = (req, res, next) => {
  const [error] = struct.validate(req.body, createRecord);

  if (error) {
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};


