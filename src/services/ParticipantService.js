import { PrismaClient } from '@prisma/client';
import { hashPassword, isPasswordValid } from "#utils/passwordUtil.js";

const prisma = new PrismaClient();

const createParticipant = async (data) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const hashedPassword = await hashPassword(data.password);
      const participant = await tx.participant.create({
        data: {
          nickname: data.nickname,
          password: hashedPassword,
          groupId: parseInt(data.groupId),
        }
      });

      const groupWithRelationData = await tx.group.findUnique({
        where: { id: participant.groupId },
        include: {
          tags: {
            select: {
              name: true
            }
          },
          owner: {
            select: {
              id: true,
              nickname: true,
              createdAt: true,
              updatedAt: true
            }
          },
          participants: {
            select: {
              id: true,
              nickname: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      });

      const resultGroup = {
        ...groupWithRelationData,
        tags: groupWithRelationData.tags.map(tag => tag.name)
      };

      return resultGroup;
    });
    
    return result;
  } catch (error) {
    console.error('❌ ParticipantService 에러:', error);
    throw new Error(`참여자 생성 실패: ${error.message}`);
  }
};

const deleteParticipant = async (data) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const participant = await tx.participant.findUnique({
        where: {
          groupId_nickname: {
            groupId: parseInt(data.groupId),
            nickname: data.nickname,
          }
        }
      });

      if (!participant) {
        const error = new Error('참여자를 찾을 수 없습니다.');
        error.statusCode = 400;
        throw error;
      }

      const isValid = await isPasswordValid(data.password, participant.password);
      if (!isValid) {
        const error = new Error('비밀번호가 일치하지 않습니다.');
        error.statusCode = 401;
        throw error;
      }

      const group = await tx.group.findUnique({
        where: {
          id: participant.groupId
        }
      });

      if (participant.id === group.ownerId) {
        const error = new Error('그룹 오너는 삭제할 수 없습니다.');
        error.statusCode = 400;
        throw error;
      }

      await tx.participant.delete({
        where: {
          id: participant.id
        }
      });

      return participant;
    });

    return result;
  } catch (error) {
    console.error('❌ ParticipantService 에러:', error);
    throw new Error(`참여자 삭제 실패: ${error.message}`);
  }
};

export default { createParticipant, deleteParticipant };
