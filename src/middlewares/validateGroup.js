import { array, integer, min, object, size, string } from 'superstruct';

export const createGroup = object({
  name: size(string(), 1, 20),
  description: size(string(), 1, 300),
  photoUrl: string(),
  goalRep: integer(),
  discordWebhookUrl: string(),
  discordInviteUrl: string(),
  tags: array(size(string(), 1, 10)),
});