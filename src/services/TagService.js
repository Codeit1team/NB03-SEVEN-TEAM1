import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createTag = async (id, data) => {
  return await prisma.tag.create({
    data,
  })
};

export default tagService = {
  createTag
};


