import * as struct from 'superstruct'

const validateTagList = async (req, res, next) => {
  if (req.body.time && typeof req.body.time === 'string') {
    req.body.time = parseInt(req.body.time)
  }

  if (req.body.distance && typeof req.body.distance === 'string') {
    req.body.distance = Number(req.body.distance)
  }

  const [error] = struct.validate(req.body, createRecord);

  if (error) {
    await deleteUploadedFiles(req.files.photos);
    const field = error.path?.[0];
    const message = field ? `${field} 해당 데이터가 유효하지 않습니다` : '데이터가 잘못되었습니다';
    return res.status(400).json({ message });
  }
  next();
};

export default {
  validateTagList
}