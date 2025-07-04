import ParticipantService from "#services/ParticipantService.js";

const createParticipant = async (req, res, next) => {
  try {
    const participantData = {
      ...req.body,
      groupId,
    };
    
    const participant = await ParticipantService.createParticipant(participantData);
    return res.status(201).json(participant);
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    next(error);
  }
};

const deleteParticipant = async (req, res, next) => {
  try {
    const participantData = {
      ...req.body,
      groupId
    };
    
    await ParticipantService.deleteParticipant(participantData);
    return res.status(204).send();
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    next(error);
  }
}

export default { createParticipant, deleteParticipant };
