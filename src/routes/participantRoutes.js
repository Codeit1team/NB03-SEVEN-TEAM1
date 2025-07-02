import { Router } from 'express';
import { validateCreateParticipant } from '#middlewares/validateParticipant.js';
import ParticipantController from '#controllers/participantController.js';

const ParticipantRouter = Router();

ParticipantRouter.route('/')
  .post(validateCreateParticipant,ParticipantController.createParticipant);

  export default ParticipantRouter;