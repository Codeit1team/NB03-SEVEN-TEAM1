import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const getTagList = async ({ search = '', page = 1, limit = 10, order = 'desc', orderBy = 'createdAt' }) => {
  let where = {}

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

// const getTag = async (req, res, next) => {
//   try {
//     const { tagId } = req.query

//     if (!tagId || isNaN(Number(tagId))) {
//       const error = new Error('태그가 존재하지 않습니다.')
//       error.status = 404
//       throw error;
//     }

//     const tag = await prisma.tag.findUnique({
//       where: { id: Number(tagId) },
//       select: {
//         name: true,
//         createdAt: true,
//         updatedAt: true,
//       }
//     })

//     if (!tag) {
//       const error = new Error('태그가 존재하지 않습니다.')
//       error.status = 404
//       throw error;
//     }

//     res.status(200).json(tag)
//   } catch (error) {
//     console.error('getTag 오류:', error.message)
//     return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
//   }
// }

export default { getTagList, getTag }