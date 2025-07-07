import TagService from '#services/tagService.js'

const getTagList = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10, order = 'desc', orderBy = 'createdAt' } = req.query //req.query로 들어오는 값이 모두 문자열이기 때문에 '1'처럼 표시해줘야 함. 이후 pageNum으로 숫자로 변환
    const { data, total } = await TagService.getTagList({search, page: parseInt(page, 10), limit: parseInt(limit, 10), order, orderBy})
    res.status(200).json({ data, total })
  } catch (error) {
    if (error.message === '태그 리스트를 불러올 수 없습니다.') {
      return res.status(400).json({ message: error.message });
    }
    console.error('getTags 오류:', error.message)
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
}

export default { getTagList }