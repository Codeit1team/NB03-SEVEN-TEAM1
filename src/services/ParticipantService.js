import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createParticipant = async (data) => {
  return await prisma.participant.create({
    data,
  })
};

export default { createParticipant };


