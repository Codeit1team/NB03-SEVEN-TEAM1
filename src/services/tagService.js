import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const getTagList = async ({ search = '', page = 1, limit = 10, order = 'desc', orderBy = 'createdAt' }) => {
  // if (typeof search !== 'string') {
  //   throw new Error('태그 리스트를 불러올 수 없습니다.')
  //   error.status = 404
  // } 유효성으로 넘기기
  const searchTrimmed = search.trim()
  let where = {}

  if (searchTrimmed) {
    where = {
      name: {
        contains: searchTrimmed,
        mode: 'insensitive',
      }
    }
  }
  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      where,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        [orderBy]: order,
      },
    }),
    prisma.tag.count({ where }),
  ])
  return { data: tags, total }
}

const getTag = async (req, res, next) => {
  try {
    const { tagId } = req.query

    const tag = await prisma.tag.findUnique({
      where: { id: Number(tagId) },
      select: {
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    res.status(200).json(tag)
  } catch (error) {
    console.error('getTag 오류:', error.message)
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
}

export default { getTagList, getTag }