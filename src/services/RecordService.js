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

const getRecordList = async (groupId, page, limit, orderBy = { id: 'desc' }) => {
  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where: {
        author: {
          groupId: groupId
        }
      },
      orderBy,
      select: {
        id: true,
        exerciseType: true,
        description: true,
        time: true,
        distance: true,
        photos: true,
        author: {
          select: {
            id: true,
            nickname: true,
          }
        }
      }
    }),
    prisma.record.count({
      where: {
        author: {
          groupId: groupId
        }
      }
    })
  ]);

  return {
    data: records,
    total
  };
};

export default {
  createRecord
}



