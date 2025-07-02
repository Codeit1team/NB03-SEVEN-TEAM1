import { PrismaClient } from '@prisma/client';
import { hashPassword } from "#utils/passwordUtil.js";

const prisma = new PrismaClient();

const createGroup = async (data) => {
  const {
    name,
    description,
    photoUrl,
    goalRep,
    discordWebhookUrl,
    discordInviteUrl,
    tags,
    ownerNickname,
    ownerPassword,
  } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const hashedPassword = await hashPassword(ownerPassword);
      const owner = await tx.participant.create({
        data: {
          nickname: ownerNickname,
          password: hashedPassword
        }
      });

      const group = await tx.group.create({
        data: {
          name,
          description,
          photoUrl,
          goalRep,
          discordWebhookUrl,
          discordInviteUrl,
          likeCount: 0,
          recordCount: 0,
          ownerId: owner.id,
          badges: [],
        }
      });

      if (tags && tags.length > 0) {
        const tagRecords = await Promise.all(
          tags.map(tagName =>
            tx.tag.upsert({
              where: { name: tagName },
              update: {},
              create: { name: tagName }
            })
          )
        );

        await tx.group.update({
          where: { id: group.id },
          data: {
            tags: { connect: tagRecords.map(tag => ({ id: tag.id })) }
          }
        });
      }

      await tx.participant.update({
        where: { id: owner.id },
        data: {
          groupId: group.id
        }
      });

      const groupWithRelationData = await tx.group.findUnique({
        where: { id: group.id },
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
          Participants: {
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
    console.error('❌ GroupService 에러:', error);
    throw new Error(`그룹 생성 실패: ${error.message}`);
  }
}

const likeGroup = async(groupId) => {
  await prisma.group.update({
    where: {
      id: parseInt(groupId),
    },
    data: {
      likeCount: {
        increment: 1,
      }
    }
  })
}

export default {
  createGroup,
  likeGroup
};