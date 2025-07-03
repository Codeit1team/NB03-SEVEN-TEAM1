import GroupService from "#services/GroupService.js";

const createGroup = async (req, res, next) => {
  try {
    if (req.files.photoUrl && req.files.photoUrl.fieldname === 'photoUrl') {
      req.files.photoUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    }
    
    const result = await GroupService.createGroup(req.body);
    return res.status(201).json(result);
  } catch (error) {
    error.status = 400;
    error.message = '그룹 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

export default { createGroup };