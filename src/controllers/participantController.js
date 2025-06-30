import ParticipantService from "#services/ParticipantService";

const createParticipant = async (req, res, next) => {
  try {
    const participant = await ParticipantService.createParticipant(req.body);
    return res.status(201).json(participant);
  } catch (error) {
    error.status = 400;
    error.message = '기록 생성에 실패했습니다. 데이터가 올바른지 확인해주세요.';
    next(error);
  }
};

export default { createParticipant };
