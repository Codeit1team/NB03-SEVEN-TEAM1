const validateTagList = async (req, res, next) => {
  try {
    const {
      search = '',
      order = 'desc',
    } = req.params;

    if (typeof search !== 'string') {
      const error = new Error('검색어가 올바르지 않습니다.')
      error.status = 400
      return next(error)
    }

    if (!['asc', 'desc'].includes(order)) {
      req.params.order = 'desc'
    };

    next();
  } catch (error) {
    error.status = error.status || 400;
    next(error);
  }
}

const validateTagId = async (req, res, next) => {
  const { tagId } = req.params

  if (!tagId || isNaN(Number(tagId))) {
    const error = new Error('태그 아이디가 존재하지 않습니다.')
    error.status = 400
    return next(error)
  }
  req.params.tagId = Number(tagId)
  next();
}

export default {
  validateTagList,
  validateTagId
}