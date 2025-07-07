const validateTagList = async (req, res, next) => {
  if (typeof req.body.search !== 'string') {
    const error = new Error('태그 리스트를 불러올 수 없습니다.')
    error.status = 404
    throw error;
  }

  if (!['asc', 'desc'].includes(order)) {
    order = 'desc'
  };

  const searchTrimmed = search.trim()

  if (searchTrimmed) {
    where = {
      name: {
        contains: searchTrimmed,
        mode: 'insensitive',
      }
    }
  }

  next();
};

const validateTagSearch = async (req, res, next) => {
  const { tagId } = req.query

  if (!tagId || isNaN(Number(tagId))) {
    const error = new Error('태그가 존재하지 않습니다.')
    error.status = 404
    throw error;
  }
}

export default {
  validateTagList,
  validateTagSearch
}