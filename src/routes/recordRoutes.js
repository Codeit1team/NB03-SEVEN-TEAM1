import express from 'express'
import recordController from '#controllers/recordController.js'

const recordRouter = express.Router()

recordRouter.route('/:recordId')
  .get(recordController.getRecordDetail)

export default recordRouter