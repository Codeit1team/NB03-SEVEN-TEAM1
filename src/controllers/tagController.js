import TagService from "#services/TagService";

const createTag = async (req, res, next) => {
  try {
    const tag = await TagService.createTag(id, req.body);
    return res.status(201).json(tag);
  } catch (error) {
    error.status = 400;
    error.message = '기록 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

export default { createTag };
