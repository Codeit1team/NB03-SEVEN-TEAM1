import { Router } from 'express';
import { validateCreateParticipant, validatePatchParticipant } from '#middlewares/validateParticipant.js';
import { uploadImages } from '#middlewares/upload.js';
import ParticipantController from '#controllers/participantController.js';

const ParticipantRouter = Router();

ParticipantRouter.route('/')
  .post(validateCreateParticipant,ParticipantController.createParticipant);