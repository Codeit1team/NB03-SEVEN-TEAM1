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

const getRecordDetail = async (id) => {
  const recordId = Number(id) //url 파라미터는 문자열로 들어와서 변환 필요
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