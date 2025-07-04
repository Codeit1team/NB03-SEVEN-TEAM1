import { Router } from 'express';
import { validateCreateGroup, validatePatchGroup } from '#middlewares/validateGroup.js';
import { uploadImages } from '#middlewares/upload.js';
import GroupController from '#controllers/groupController.js';

const GroupRouter = Router();

GroupRouter.route('/')
  .post(uploadImages(), validateCreateGroup, GroupController.createGroup);

GroupRouter.route('/like/:groupId')
  .post(GroupController.likeGroup)
  .delete(GroupController.unlikeGroup);

export default GroupRouter;