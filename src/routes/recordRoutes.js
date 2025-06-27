import express from 'express'

const recordRouter = express.Router()

recordRouter.route('/groups/{:groupId}/records/{:recordId}')