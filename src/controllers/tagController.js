import TagService from '#services/tagService.js'
import handleServerError from "#utils/handleServerError.js";

const getTagList = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10, order = 'desc', orderBy = 'createdAt' } = req.query //req.query로 들어오는 값이 모두 문자열이기 때문에 '1'처럼 표시해줘야 함. 이후 pageNum으로 숫자로 변환
    const { data, total } = await TagService.getTagList({ search, page: parseInt(page, 10), limit: parseInt(limit, 10), order, orderBy })
    res.status(200).json({ data, total })
  } catch (error) {
    next(handleServerError);
  }
}

const getTag = async (req, res, next) => {
  try {
    const { tagId } = req.query

    if (!tagId || isNaN(Number(tagId))) {
      const error = new Error('태그가 존재하지 않습니다.')
      error.status = 404
      throw error;
    }

    const tag = await prisma.tag.findUnique({
      where: { id: Number(tagId) },
      select: {
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!tag) {
      const error = new Error('태그가 존재하지 않습니다.')
      error.status = 404
      throw error;
    }

    res.status(200).json(tag)
  } catch (error) {
    next(handleServerError)
  }
}

export default { getTagList }