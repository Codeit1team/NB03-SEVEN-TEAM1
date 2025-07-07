const validateTagList = async (req, res, next) => {
  try {
    if (typeof req.query.search !== 'string') {
      const error = new Error('태그 리스트를 불러올 수 없습니다.')
      error.status = 404
      return next(error)
    }

    if (!['asc', 'desc'].includes(req.query.order)) {
      req.query.order = 'desc'
    };

    next();
  };

  const validateTagSearch = async (req, res, next) => {
    const { tagId } = req.query

    if (!tagId || isNaN(Number(tagId))) {
      const error = new Error('태그가 존재하지 않습니다.')
      error.status = 404
      return next(error)
    }
    next();
  } catch (err) {}
}

export default {
  validateTagList,
  validateTagSearch
}