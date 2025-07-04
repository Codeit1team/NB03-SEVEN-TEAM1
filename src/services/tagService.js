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

// const createTag = async (req, res, next) => {
//   try {
//     //태그 유효성 검사 넣어야하나?
//     const { id: groupId } = req.params;
//     let { tagName } = req.body;

//     if (typeof tagName === 'string') {
//       tagName = [tagName]
//     }

//     const createdTags = []

//     for (const name of tagName) {
//       const tag = await prisma.tag.create({
//         data: {
//           name,
//           groups: { connect: { id: Number(groupId) } }
//         }
//       })
//       createdTags.push(tag)
//     }

//     return res.status(201).json(createdTags)
//   } catch (error) {
//     if (error?.name === 'StructError') {
//       return res.status(400).end()
//     }
//   }
// }

// const searchGroupsByTag = async (tag) => {
//   if (!tag || typeof tag !== 'string' || tag.trim() === '') {
//     throw new Error('유효하지 않은 태그')
//   }

//   const [groups, total] = await Promise.all([
//     prisma.group.findMany({
//       where: {
//         tags: {
//           some: {
//             name: {
//               equals: tag,
//               mode: 'insensitive'
//             }
//           }
//         }
//       },
//       include: {
//         tags: true,
//         owner: {
//           select: {
//             id: true,
//             nickname: true,
//           }
//         }
//       }
//     }),
//     prisma.group.count({
//       where: {
//         tags: {
//           some: {
//             name: {
//               equals: tag,
//               mode: 'insensitive',
//             }
//           }
//         }
//       }
//     })
//   ])
//   return { data: groups, total }
// }

// const searchTag = async (req, res, next) => {
//   try {
//     const { tag } = req.query

//     if (!tag || typeof tag !== 'string' || tag.trim() === '') {
//       return res.status(400).json({ message: '태그가 유효하지 않습니다' })
//     }

//     const tags = await prisma.tag.findMany({
//       where: {
//         tags: {
//           some: {
//             name: {
//               equals: tag,
//               mode: 'insensitive'
//             }
//           }
//         }
//       },
//       include: {
//         tags: true,
//         owner: {
//           select: {
//             id: true,
//             nickname: true,
//           }
//         }
//       }
//     })

//     res.status(200).json({ data: groups, total })
//   } catch (error) {
//     console.error('searchGroupsByTag 오류:', error.message)
//     return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
//   }
// }

export default { getTags }