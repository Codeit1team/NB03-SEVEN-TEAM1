import { PrismaClient, BadgeType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 참여자 10명 이상일 때만, 'PARTICIPATION_10' 배지가 없으면 부여
 * @param {number} groupId
 * @returns {Promise<boolean>}
 * @example
 * await grantParticipation10Badge(1);
 */
export const grantParticipation10Badge = async (groupId) => {
  try {
    const participantCount = await prisma.participant.count({ where: { groupId } });
    if (participantCount < 10) return false;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { badges: true }
    });

    if (!group) return false;
    if (group.badges.includes(BadgeType.PARTICIPATION_10)) return false;

    await prisma.group.update({
      where: { id: groupId },
      data: { badges: { push: BadgeType.PARTICIPATION_10 } }
    });

    return true;
  } catch (error) {
    console.error('❌ grantParticipation10Badge 에러:', error);
    return false;
  }
};

/**
 * 운동기록 100개 이상일 때만, 'RECORD_100' 배지가 없으면 부여
 * @param {number} groupId
 * @returns {Promise<boolean>}
 * @example
 * await grantRecord100Badge(1);
 */
export const grantRecord100Badge = async (groupId) => {
  try {
    const recordCount = await prisma.record.count({ where: { author: { groupId } } });
    if (recordCount < 100) return false;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { badges: true }
    });

    if (!group) return false;
    if (group.badges.includes(BadgeType.RECORD_100)) return false;

    await prisma.group.update({
      where: { id: groupId },
      data: { badges: { push: BadgeType.RECORD_100 } }
    });

    return true;
  } catch (error) {
    console.error('❌ grantRecord100Badge 에러:', error);
    return false;
  }
};

/**
 * 그룹의 추천수(likeCount)와 배지 보유 여부를 한 번에 조회해서,
 * 조건 충족 & 미보유 시 'LIKE_100' 배지 부여
 * @param {number} groupId
 * @returns {Promise<boolean>}
 * @example
 * await grantLike100Badge(1);
 */
export const grantLike100Badge = async (groupId) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { likeCount: true, badges: true }
    });

    if (!group) return false;
    if (group.likeCount < 100) return false;
    if (group.badges.includes(BadgeType.LIKE_100)) return false;

    await prisma.group.update({
      where: { id: groupId },
      data: { badges: { push: BadgeType.LIKE_100 } }
    });

    return true;
  } catch (error) {
    console.error('❌ grantLike100Badge 에러:', error);
    return false;
  }
};