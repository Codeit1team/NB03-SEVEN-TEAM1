import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

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

const getRecords = async (groupId, page = 1, limit = 10, order = 'createdAt', orderBy = 'desc', search = '') => {
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

const getRecordDetail = async (id) => {
  const recordId = Number(id) //url 파라미터는 문자열로 들어와서 변환 필요
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
    const error = new Error('Record not found')
    error.status = 400
    throw error
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

export default {
  createRecord,
  getRecords,
  getRecordDetail
}