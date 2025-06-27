import { Router } from 'express';
import { validateCreateGroup, validatePatchGroup } from '#middlewares/validateRecord';
import { uploadImages } from '#middlewares/upload';
import GroupController from '#controllers/groupController.js';

const GroupRouter = Router();

GroupRouter.route(':id')
  .post(uploadImages(),validateCreateGroup,GroupController.createGroup);