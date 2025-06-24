import axios from 'axios';

/**
 * Discord Webhook으로 메시지를 전송합니다.
 * @param {string} webhookUrl - Discord Webhook URL
 * @param {string} message - 전송할 텍스트 메시지
 * @returns {Promise<boolean|undefined>} - 성공 시 true, URL 미지정 또는 실패 시 undefined
 */
const sendDiscordWebhook = async (webhookUrl, message) => {
  try {
    if (!webhookUrl) return;

    await axios.post(webhookUrl, {
      content: message,
    });
    return true;
  } catch (error) {
    console.error('❌ Discord Webhook 전송 실패:', error.response?.data || error.message);
  }
};

export default sendDiscordWebhook;

/*
사용예시
import sendDiscordWebhook from '../utils/sendDiscordWebhook.js';

await sendDiscordWebhook(group.discordWebhook, `📢 ${nickname} 님이 운동을 기록했습니다!`);
*/