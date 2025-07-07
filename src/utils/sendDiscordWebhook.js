import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 그룹에서 Discord Webhook URL을 조회합니다.
 * @param {number|string} groupId - 그룹의 고유 ID
 * @returns {Promise<string|undefined>} - Webhook URL (없으면 undefined)
 *
 * @example
 * import { PrismaClient } from '@prisma/client';
 * const prisma = new PrismaClient();
 * import { getGroupWebhookUrl } from '#utils/sendDiscordWebhook.js';
 * const webhookUrl = await getGroupWebhookUrl(groupId);
 */
const getGroupWebhookUrl = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { webhookUrl: true },
  });
  return group?.webhookUrl;
};

/**
 * Discord Webhook으로 메시지를 전송합니다.
 * @param {string} webhookUrl - Discord Webhook URL
 * @param {string} message - 전송할 텍스트 메시지
 * @returns {Promise<boolean>} - 성공 시 true, 실패 시 false
 *
 * @example
 * // 그룹에서 webhookUrl을 조회해 메시지를 발송하는 예시
 * import { PrismaClient } from '@prisma/client';
 * const prisma = new PrismaClient();
 * import { getGroupWebhookUrl, sendDiscordWebhook } from '#utils/sendDiscordWebhook.js';
 *
 * const webhookUrl = await getGroupWebhookUrl(groupId);
 * if (webhookUrl) {
 *   await sendDiscordWebhook(webhookUrl, 📢 ${nickname} 님이 운동을 기록했습니다!);
 * }
 */
const sendDiscordWebhook = async (webhookUrl, message) => {
  try {
    if (!webhookUrl) return false;

    await axios.post(webhookUrl, {
      content: message,
    });
    return true;
  } catch (error) {
    console.error('❌ Discord Webhook 전송 실패:', error.response?.data || error.message);
    return false;
  }
};

export { getGroupWebhookUrl, sendDiscordWebhook };