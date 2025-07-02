import GroupService from "#services/GroupService.js";

const createGroup = async (req, res, next) => {
  try {
    const result = await GroupService.createGroup(req.body);
    return res.status(201).json(result);
  } catch (error) {
    error.status = 400;
    error.message = '그룹 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

const likeGroup = async (req, res, next) => {
  try{
    const id = req.params.id;
    await GroupService.likeGroup(id);
    res.sendStatus(204);
  } catch (error) {
    error.status = 404;
    error.message = "요청이 잘못 되었습니다. 해당 그룹은 없습니다"
    next(error);
  }
}

export default { 
  createGroup,
  likeGroup
};