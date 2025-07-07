const validateTagList = async (req, res, next) => {
  try {
    const {
      search = '',
      order = 'desc',
    } = req.params;

    if (typeof search !== 'string') {
      const error = new Error('태그 리스트를 불러올 수 없습니다.')
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

const validateTagSearch = async (req, res, next) => {
  const { tagId } = req.params

  if (!tagId || isNaN(Number(tagId))) {
    const error = new Error('태그가 존재하지 않습니다.')
    error.status = 400
    return next(error)
  }
  next();
}

export default {
  validateTagList,
  validateTagSearch
}