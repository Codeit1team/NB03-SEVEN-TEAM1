import { Router } from 'express';
import tagController from '#controllers/tagController.js';
import validateTag from '#middlewares/validateTag.js';

const TagRouter = Router();

TagRouter.route('/')
  .get(validateTag.validateTagList, tagController.getTagList)

// TagRouter.route('/:tagId')
//   .get(validateTag.validateTagSearch, tagController.getTag)

export default TagRouter