import { Router } from 'express';
import validateParticipant from '#middlewares/validateParticipant.js';
import ParticipantController from '#controllers/participantController.js';

const ParticipantRouter = Router();

ParticipantRouter.route('/:groupId')
  .post(validateParticipant.validateIdParam('groupId','그룹아이디'), validateParticipant.validateCreateParticipant, ParticipantController.createParticipant)
  .delete(validateParticipant.validateIdParam('groupId','그룹아이디'), ParticipantController.deleteParticipant);

export default ParticipantRouter;