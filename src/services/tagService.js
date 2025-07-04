import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const getTags = async ({ search = '', page = 1, limit = 10, order = 'desc', orderBy = 'createdAt' }) => {
  if (typeof search !== 'string') {
    throw new Error('태그 리스트를 불러올 수 없습니다.')
  }
  const trimmed = search.trim()
  let where = {}

  if (trimmed) {
    where = {
      name: {
        contains: trimmed,
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
    prisma.tag.count(),
  ])
  return { data: tags, total }
}

export default { getTags }