import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export default recordService = {
  createRecord
};


