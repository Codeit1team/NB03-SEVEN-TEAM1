import { Router } from 'express';
import { validateCreateParticipant } from '#middlewares/validateParticipant.js';
import ParticipantController from '#controllers/participantController.js';

const ParticipantRouter = Router();

ParticipantRouter.route('/:groupId')
  .post(validateCreateParticipant, ParticipantController.createParticipant)
  .delete(ParticipantController.deleteParticipant);

export default ParticipantRouter;