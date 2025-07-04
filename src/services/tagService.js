import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const getTagList = async ({ search = '', page = 1, limit = 10, order = 'desc', orderBy = 'createdAt' }) => {
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

// const getTag = async (req, res, next) => {
//   try {
//     const { tagId } = req.query

//     const tag = await prisma.tag.findUnique({
//       where: {
//         tags: {
//           some: {
//             name: {
//               equals: { id: tagId },
//               mode: 'insensitive'
//             }
//           }
//         }
//       },
//       select: {
//         name: true,
//         createdAt: true,
//         updatedAt: true,
//       }
//     })

//     res.status(200).json(tag)
//   } catch (error) {
//     console.error('searchGroupsByTag 오류:', error.message)
//     return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
//   }
// }

export default { getTagList, getTag }