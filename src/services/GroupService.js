import { PrismaClient } from '@prisma/client';
import { hashPassword, isPasswordValid } from "#utils/passwordUtil.js";

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
        password: hashedPassword,
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
}

const getGroups = async (page = 1, limit = 10, order = 'desc', orderBy = 'createdAt', search = '') => {
  const intPage = parseInt(page, 10);
  const intLimit = parseInt(limit, 10);
  
  let where = {};
  if (search.trim()) {
    where = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };
  }

  // participantCount 정렬을 위한 특별 처리
  let orderByConfig;
  if (orderBy === 'participantCount') {
    orderByConfig = {
      participants: {
        _count: order
      }
    };
  } else {
    orderByConfig = {
      [orderBy]: order,
    };
  }
  
  const [groupsWithRelationData, total] = await Promise.all([
    prisma.group.findMany({
      where,
      orderBy: orderByConfig,
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
        participants: {
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

  if (!groupWithRelationData) {
    const error = new Error('그룹을 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  const resultGroup = {
    ...groupWithRelationData,
    tags: groupWithRelationData.tags.map(tag => tag.name)
  };

  return resultGroup;
}

const updateGroup = async (groupId, data) => {
  const result = await prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      const error = new Error('그룹을 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }

    const owner = await tx.participant.findUnique({
      where: { id: group.ownerId },
    });

    if (!owner) {
      const error = new Error('소유자를 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }

    if (!await isPasswordValid(data.ownerPassword, owner.password)) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.status = 401;
      throw error;
    }

    const groupUpdateData = {
      name: data.name,
      description: data.description,
      photoUrl: data.photoUrl,
      goalRep: data.goalRep,
      discordWebhookUrl: data.discordWebhookUrl,
      discordInviteUrl: data.discordInviteUrl,
    };

    if (data.tags !== undefined) {
      let tagRecords = [];
      
      if (data.tags && data.tags.length > 0) {
        tagRecords = await Promise.all(
          data.tags.map(tagName =>
            tx.tag.upsert({
              where: { name: tagName },
              update: {},
              create: { name: tagName }
            })
          )
        );
      }

      // 태그 관계 초기화 후 연결
      groupUpdateData.tags = {
        set: [],
        connect: tagRecords.map(tag => ({ id: tag.id }))
      };
    }

    // 그룹 업데이트 적용
    await tx.group.update({
      where: { id: groupId },
      data: groupUpdateData
    });

    // 고아 태그 삭제
    if (data.tags !== undefined) {
      await tx.tag.deleteMany({
        where: {
          groups: { none: {} }
        }
      });
    }

    const groupWithRelationData = await tx.group.findUnique({
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
}

const deleteGroup = async (groupId, password) => {
  await prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      const error = new Error('그룹을 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }

    const owner = await tx.participant.findUnique({
      where: { id: group.ownerId },
    });

    if (!owner) {
      const error = new Error('소유자를 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }

    if (!await isPasswordValid(password, owner.password)) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.status = 401;
      throw error;
    }

    await tx.group.delete({
      where: { id: groupId },
    });

    await tx.tag.deleteMany({
      where: {
        groups: { none: {} }
      }
    });
  });
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
  updateGroup,
  deleteGroup,
  likeGroup,
  unlikeGroup
};