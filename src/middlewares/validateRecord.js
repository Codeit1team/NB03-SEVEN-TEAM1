import * as struct from 'superstruct'

const createRecord = struct.object({
  type: struct.enums(['RUNNING', 'BIKING', 'SWIMMING']),
  description: struct.optional(struct.size(struct.string(), 0, 300)),
  time: struct.refine(interger(), 'timeLimit', (value) => {
    return value > 0 && value <= (3600 * 10)
  }),
  distance: struct.refine(struct.number(), 'distanceLimit', (value) => {
    return value > 0 && value <= 1000
  }),
  groupId: struct.string(),
  participantId: struct.string(),
  images: struct.optional(struct.array(struct.string())),
})

const patchRecord = struct.partial(createRecord);

export const validateCreateRecord = (req, res, next) => {
  const [error] = validate(req.body, createRecord);

  if (error) {
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다`:'데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
}

export const validatePatchRecord = (req, res, next) => {
  const [error] = validate(req.body, patchRecord);

  if (error) {
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다`:'데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
}


