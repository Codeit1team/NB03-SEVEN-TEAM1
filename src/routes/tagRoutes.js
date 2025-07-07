import { Router } from 'express';
import tagController from '#controllers/tagController.js';
import validateTag from '#middlewares/validateTag.js';

const TagRouter = Router();

TagRouter.route('/')
  .get(validateTag.validateTagList, tagController.getTagList)

export default TagRouter