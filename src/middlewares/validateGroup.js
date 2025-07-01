import * as struct from 'superstruct'

export const createGroup = struct.object({
  name: struct.size(struct.string(), 1, 20),
  description: struct.optional(struct.size(struct.string(), 0, 500)),
  goalRep: struct.refine(struct.integer(), 'PositiveInt', (value) => value >= 0),
  discordWebhookUrl: struct.optional(struct.url()),
  discordInviteUrl: struct.optional(struct.url()),

  tags: struct.optional(struct.array(struct.size(struct.string(), 1, 20))),

  ownerNickname: struct.size(struct.string(), 1, 20),
  ownerPassword: struct.size(struct.string(), 4, 20),
});

export const patchGroup = struct.partial(createGroup);

export const validateCreateGroup = (req, res, next) => {
  const [error] = struct.validate(req.body, createGroup);

  if (error) {
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