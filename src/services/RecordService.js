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

const recordService = {
  createRecord
};

export default recordService;



