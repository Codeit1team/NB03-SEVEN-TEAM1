import express from 'express'

const recordRouter = express.Router()

recordRouter.route('/:recordId')
  .get((req, res) => {})