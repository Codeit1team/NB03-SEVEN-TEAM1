import * as struct from 'superstruct'

const createTag = struct.object({
  name: struct.size(struct.string(), 1, 20),
});

const patchTag = struct.partial(createTag);

export const validateCreateTag = (req, res, next) => {
  const validatedBody = struct.mask(req.body, createTag);
  const [error] = struct.validate(validatedBody, createTag);

  if (error) {
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};

export const validatePatchTag = (req, res, next) => {
  const validatedBody = struct.mask(req.body, patchTag);
  const [error] = validate(validatedBody, patchTag);

  if (error) {
    const field = error.path[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};


