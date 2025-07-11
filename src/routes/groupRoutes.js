import { Router } from 'express';
import validateGroup from '#middlewares/validateGroup.js';
import GroupController from '#controllers/groupController.js';

const GroupRouter = Router();

GroupRouter.route('/')
  .post(validateGroup.validateCreateGroup, GroupController.createGroup)
  .get(validateGroup.validateGetGroups, GroupController.getGroups);

GroupRouter.route('/:groupId')
  .get(validateGroup.validateIdParam('groupId','그룹아이디'), GroupController.getGroupDetail)
  .patch(validateGroup.validateIdParam('groupId','그룹아이디'), validateGroup.validatePatchGroup, GroupController.updateGroup)
  .delete(validateGroup.validateIdParam('groupId','그룹아이디'), GroupController.deleteGroup);

GroupRouter.route('/like/:groupId')
  .post(validateGroup.validateIdParam('groupId','그룹아이디'), GroupController.likeGroup)
  .delete(validateGroup.validateIdParam('groupId','그룹아이디'), GroupController.unlikeGroup);

export default GroupRouter;