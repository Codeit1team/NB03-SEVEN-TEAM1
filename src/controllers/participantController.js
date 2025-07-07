import ParticipantService from "#services/ParticipantService.js";
import handleServerError from "#utils/handleServerError.js";


const createParticipant = async (req, res, next) => {
  const groupId = req.params.groupId;
  try {
    const participantData = {
      ...req.body,
      groupId
    };

    const participant = await ParticipantService.createParticipant(participantData);
    return res.status(201).json(participant);
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류 그룹 참가에 실패했습니다'));
  }
};

const deleteParticipant = async (req, res, next) => {
  const groupId = req.params.groupId;
  try {
    const participantData = {
      ...req.body,
      groupId
    };

    await ParticipantService.deleteParticipant(participantData);
    return res.status(204).send();
  } catch (error) {
    next(handleServerError(error, '서버 내부 오류로 그룹 탈퇴에 실패했습니다.'));
  }
};

export default { createParticipant, deleteParticipant };