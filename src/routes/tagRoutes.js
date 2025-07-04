import { Router } from 'express';
import tagController from '#controllers/tagController.js';

const TagRouter = Router();

TagRouter.route('/')
.get(tagController.getTags)

export default TagRouter