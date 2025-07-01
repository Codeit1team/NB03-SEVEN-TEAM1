import { Router } from 'express';
import { validateCreateGroup, validatePatchGroup } from '#middlewares/validateGroup.js';
// import { uploadImages } from '#middlewares/upload.js';
import GroupController from '#controllers/groupController.js';

const GroupRouter = Router();

GroupRouter.route('/')
  .post(validateCreateGroup,GroupController.createGroup);

export default GroupRouter;