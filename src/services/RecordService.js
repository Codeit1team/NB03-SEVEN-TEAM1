import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createRecord = async (authorId, data) => {
  return await prisma.record.create({
    data: {
      exerciseType,
      description,
      time,
      distance,
      photos,
      authorId,
    }
  })
};

const recordService = {
  createRecord
};

export default recordService;



