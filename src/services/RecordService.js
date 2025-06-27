import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const createRecord = async (id, data) => {
  return await prisma.record.create({
    data: {
      exerciseType,
      description,
      time,
      distance,
      photos,
      authorId: id,
    }
  })
};

const getRecordDetail = async (id) => {
  const recordId = Number(id)
  const rec = await prisma.record.findFirst({
    where: { id: recordId },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
        }
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
    exerciseType: rec.type,
    description: rec.description,
    time: rec.time,       // ms 단위 그대로
    distance: rec.distance,
    photos: rec.images,
    author: {
      id: rec.author.id,
      nickname: rec.author.nickname,
    }
  }
}


export default { createRecord, getRecordDetail }