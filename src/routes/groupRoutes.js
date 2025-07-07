import { Router } from 'express';
import validateGroup from '#middlewares/validateGroup.js';
import { uploadImages } from '#middlewares/upload.js';
import GroupController from '#controllers/groupController.js';

const GroupRouter = Router();

GroupRouter.route('/')
  .post(uploadImages(), validateGroup.validateCreateGroup, GroupController.createGroup)
  .get(validateGroup.validateGetGroups, GroupController.getGroups);

GroupRouter.route('/:groupId')
  .get(validateGroup.validateIdParam('groupId','그룹아이디'), GroupController.getGroupDetail)
  .patch(validateGroup.validateIdParam('groupId','그룹아이디'), validateGroup.validatePatchGroup, GroupController.updateGroup);

GroupRouter.route('/like/:groupId')
  .post(validateGroup.validateIdParam('groupId','그룹아이디'), GroupController.likeGroup)
  .delete(validateGroup.validateIdParam('groupId','그룹아이디'), GroupController.unlikeGroup);

export default GroupRouter;