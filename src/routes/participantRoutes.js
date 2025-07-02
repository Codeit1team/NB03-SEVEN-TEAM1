import { Router } from 'express';
import { validateCreateParticipant } from '#middlewares/validateParticipant.js';
import ParticipantController from '#controllers/participantController.js';

const ParticipantRouter = Router();

ParticipantRouter.route('/groups/:id')
  .post(validateCreateParticipant, ParticipantController.createParticipant)
  .delete(ParticipantController.deleteParticipant);

export default ParticipantRouter;