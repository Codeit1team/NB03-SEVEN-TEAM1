import GroupService from "#services/GroupService.js";

const createGroup = async (req, res, next) => {
  try {
    if (req.files && req.files.photoUrl && req.files.photoUrl[0]) {
      req.body.photoUrl = `http://localhost:3000/uploads/${req.files.photoUrl[0].filename}`;
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