import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const getGroupRecordDetail = async (req, res, next) => {
  const { recordId, groupId } = req.params
  if (!recordId || !groupId) {
    return res.status(400).json({ message: 'Missing recordId or groupId' });
  }
  try {
    const rec = await prisma.record.findFirst({
      where: { id: recordId, groupId },
      include: {
        participant: {
          select: {
            id: true,
            nickname: true,
          }
        }
      }
    })

    if(!rec) {
      return res.status(404).json({message: 'Record not found'})
    }
    return res.status(200).json({
      id: rec.id,
      exerciseType: rec.type,
      description: rec.description,
      time: rec.time,       // ms 단위 그대로
      distance: rec.distance,
      photos: rec.images,
      author: {
        id: rec.participant.id,
        nickname: rec.participant.nickname,
      }
    })
  }
  catch (error) {
    next(error)
  }
}