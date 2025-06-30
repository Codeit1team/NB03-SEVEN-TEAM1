import { PrismaClient } from '@prisma/client';
import { hashPassword } from "#utils/passwordUtil";

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
        await Promise.all(
          tags.map(tagName => 
            tx.tag.upsert({
              where: { name: tagName },
              update: {},
              create: { name: tagName }
            })
          )
        );
      }

      await tx.group.update({
        where: { id: group.id },
        data: {
          tags: { connect: tagRecords.map(tag => ({ id: tag.id })) }
        }
      });

      await tx.participant.update({
        where: { id: owner.id },
        data: {
          groupId: group.id
        }
      });

      const finalGroup = await tx.group.findUnique({
        where: { id: group.id },
        include: {
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
          },
          tags: {
            select: {
              name: true
            }
          }
        }
      });

      return finalGroup;
    });

    return formatGroupResponse(result);

  } catch (error) {
    throw new Error(`그룹 생성 실패: ${error.message}`);
  }
}


// const formatGroupResponse = (groupData) => {
//   return {
//     id: groupData.id,
//     name: groupData.name,
//     description: groupData.description,
//     photoUrl: groupData.photoUrl,
//     goalRep: groupData.goalRep,
//     discordWebhookUrl: groupData.discordWebhookUrl,
//     discordInviteUrl: groupData.discordInviteUrl,
//     likeCount: groupData.likeCount,
//     tags: groupData.tags.map(tag => tag.name), // 태그 이름만 추출
//     owner: {
//       id: groupData.owner.id,
//       nickname: groupData.owner.nickname,
//     },
//     participants: groupData.participants.map(participant => ({
//       id: participant.id,
//       nickname: participant.nickname,
//     })),
//     badges: groupData.badges
//   };
// }

export default { createGroup };