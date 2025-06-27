import RecordService from "#services/RecordService";

const createRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.photos = req.files.map(file => `http://localhost:3000/uploads/${file.filename}`);
    const record = await RecordService.createRecord(id, req.body);
    return res.status(201).json(record);
  } catch (error) {
    error.status = 400;
    error.message = '기록 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

export default recordController.js = {
  createRecord
};

const getRecordDetail = async (req, res, next) => {
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