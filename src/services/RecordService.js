import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createRecord = async (data) => {
  return await prisma.record.create({
    data: {
      exerciseType: data.exerciseType,
      description: data.description,
      time: data.time,
      distance: data.distance,
      photos: data.photos,
      authorId: data.authorId,
    }
  })
};

const getRecords = async (groupId, page = '1', limit = '10', order = 'createdAt', orderBy = 'desc', search = '') => {
  const intPage = parseInt(page, 10);
  const intLimit = parseInt(limit, 10);
  const where = {
    author: {
      groupId: parseInt(groupId, 10),
      ...(search && search.trim() !== '' && {
        nickname: { contains: search, mode: 'insensitive' }
      })
    }
  };
  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      orderBy: {
        [order]: orderBy
      },
      skip: (intPage - 1) * intLimit,
      take: intLimit,
      select: {
        id: true,
        exerciseType: true,
        description: true,
        time: true,
        distance: true,
        photos: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            nickname: true,
          }
        }
      }
    }),
    prisma.record.count({
      where,
    })
  ]);

  return {
    data: records,
    total
  };
};

export default {
  createRecord,
  getRecords
}



