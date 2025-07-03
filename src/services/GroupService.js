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
}

const getGroups = async (page = 1, limit = 10, order = 'createdAt', orderBy = 'desc', search = '') => {
  const intPage = parseInt(page, 10);
  const intLimit = parseInt(limit, 10);
  const where = {
    name: {
      contains: search,
      mode: 'insensitive',
    },
  };
  
  const [groupsWithRelationData, total] = await Promise.all([
    prisma.group.findMany({
      where,
      orderBy: { 
        [order]: orderBy,
      },
      skip: (intPage - 1) * intLimit,
      take: intLimit,
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
    }),
    prisma.group.count({
      where,
    })
  ]);

  const resultGroups = groupsWithRelationData.map(group => ({
    ...group,
    tags: group.tags.map(tag => tag.name)
  }));

  return {
    data: resultGroups,
    total,
  }
}

const getGroupDetail = async (groupId) => {
  const groupWithRelationData = await prisma.group.findUnique({
    where: { id: groupId },
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

  if (!groupWithRelationData) {
    const error = new Error('Group not found');
    error.status = 404;
    throw error;
  }

  const resultGroup = {
    ...groupWithRelationData,
    tags: groupWithRelationData.tags.map(tag => tag.name)
  };

  return resultGroup;
}

const likeGroup = async(groupId) => {
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      likeCount: {
        increment: 1,
      }
    }
  })
}

const unlikeGroup = async(groupId) => {
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      likeCount: {
        decrement: 1,
      }
    }
  })
}

export default {
  createGroup,
  getGroups,
  getGroupDetail,
  likeGroup,
  unlikeGroup
};