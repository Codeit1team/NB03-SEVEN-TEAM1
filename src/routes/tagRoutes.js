import { Router } from 'express';
import { validateCreateTag, validatePatchTag } from '#middlewares/validateTag';
import { uploadImages } from '#middlewares/upload';
import TagController from '#controllers/tagController';

const TagRouter = Router();

TagRouter.route('/')
  .post(validateCreateTag,TagController.createTag)
