import tagService from '#services/tagService.js';

const getTagList = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10, order = 'desc', orderBy = 'createdAt' } = req.query
    const { data, total } = await tagService.getTagList({ search, page: parseInt(page, 10), limit: parseInt(limit, 10), order, orderBy })
    res.status(200).json({ data, total })
  } catch (error) {
    next(error);
  }
}

const getTag = async (req, res, next) => {
  try {
    const { tagId } = req.query

    const tag = await tagService.getTag(tagId)
    res.status(200).json(tag)
  } catch (error) {
    next(error)
  }
}

export default { getTagList, getTag }