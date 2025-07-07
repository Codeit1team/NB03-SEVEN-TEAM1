import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const getTagList = async ({ search = '', page = 1, limit = 10, order = 'desc', orderBy = 'createdAt' }) => {
  let where = {}

  const searchTrimmed = search.trim()

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
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.tag.count({ where, }),
  ])

  return { data: tags, total }
}

const getTag = async (tagId) => {

  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
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

  return tag;
}

export default { getTagList, getTag }