import { PrismaClient } from '@prisma/client';
import { hashPassword } from "#utils/passwordUtil.js";

const prisma = new PrismaClient();

const createParticipant = async (data) => {
  try {
      const result = await prisma.$transaction(async (tx) => {
        const hashedPassword = await hashPassword(ownerPassword);
        const owner = await tx.participant.create({
          data: {
            nickname: ownerNickname,
            password: hashedPassword
          }
        });
      }
    )
  } catch (error) {
    console.error('❌ GroupService 에러:', error);
    throw new Error(`그룹 생성 실패: ${error.message}`);
  }
  // return await prisma.participant.create({
  //   data,
  // })
};




export default { createParticipant };


