import RecordService from "#services/RecordService";


const createRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.photos = req.files.map(file => `http://localhost:3000/uploads/${file.filename}`);
    const record = await RecordService.createRecord(id, req.body);
    return res.status(201).json(record);
  } catch (error) {
    error.status = 400;
    error.message = '기록 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

export default recordController.js = {
  createRecord
};
