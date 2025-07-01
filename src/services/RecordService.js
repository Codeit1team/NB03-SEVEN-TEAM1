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

const getRanks = async (groupId, page = '1', limit = '10', duration = 'weekly') => {
  const intPage = parseInt(page, 10);
  const intLimit = parseInt(limit, 10);
  const now = new Date();
  const startDate = new Date(now);

  if (duration === 'weekly') {
    startDate.setDate(now.getDate() - 7);
  } else {
    startDate.setMonth(now.getMonth() - 1);
  }

  const rankings = await prisma.record.groupBy({
    by: ['authorId'],
    where: {
      author: {
        groupId: parseInt(groupId)
      },
      createdAt: {
        gte: startDate,
        lte: now
      }
    },
    _count: true,
    _sum: {
      time: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    skip: (intPage - 1) * intLimit,
    take: intLimit
  });

  const authorIds = rankings.map(ranking => ranking.authorId);
  const participants = await prisma.participant.findMany({
    where: {
      id: { in: authorIds }
    },
    select: {
      id: true,
      nickname: true
    }
  });

  const nicknameMap = Object.fromEntries(
    participants.map(participant => [participant.id, participant.nickname])
  );

  return rankings.map(ranking => ({
    participantId: ranking.authorId,
    nickname: nicknameMap[ranking.authorId] || '이름 없음',
    recordCount: ranking._count ?? 0,
    recordTime: ranking._sum.time ?? 0
  }));
}
export default {
  createRecord,
  getRecords,
  getRanks
}



