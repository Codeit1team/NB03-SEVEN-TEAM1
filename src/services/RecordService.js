import { PrismaClient } from "@prisma/client";
import { moveTempToPermanent } from '#utils/manageImageFiles.js';

const prisma = new PrismaClient()

const createRecord = async (groupId, data) => {
  const movedPhotos = [];

  for (const photoUrl of data.photos || []) {
    if (photoUrl?.includes('/api/files/temp/')) {
      const moved = await moveTempToPermanent(photoUrl);
      movedPhotos.push(moved);
    } else {
      movedPhotos.push(photoUrl);
    }
  }

  return await prisma.$transaction(async (tx) => {
    const record = await tx.record.create({
      data: {
        exerciseType: data.exerciseType,
        description: data.description,
        time: data.time,
        distance: data.distance,
        photos: movedPhotos,
        authorId: data.authorId,
      },
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
          },
        },
      },
    });

    await tx.group.update({
      where: {
        id: groupId,
      },
      data: {
        recordCount: {
          increment: 1,
        },
      },
    });

    return record;
  });
};

const getRecords = async (groupId, page = 1, limit = 10, order = 'desc', orderBy = 'createdAt', search = '') => {
  const intPage = parseInt(page, 10);
  const intLimit = parseInt(limit, 10);
  const where = {
    author: {
      groupId,
      ...(search && search.trim() !== '' && {
        nickname: { contains: search, mode: 'insensitive' }
      })
    }
  };
  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      orderBy: {
        [orderBy]: order
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

const getRecordDetail = async (id) => {
  const recordId = id; 
  const rec = await prisma.record.findUnique({
    where: { id: recordId },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
        },
      }
    }
  })

  if (!rec) {
  const error = new Error("기록이 존재하지 않습니다.");
  error.status = 404;
  throw error;
}

  return {
    id: rec.id,
    exerciseType: rec.exerciseType,
    description: rec.description,
    time: rec.time,       // ms 단위 그대로
    distance: rec.distance,
    photos: rec.photos,
    author: {
      id: rec.author.id,
      nickname: rec.author.nickname,
    }
  }
}

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
        groupId
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
  getRecordDetail,
  getRanks
}