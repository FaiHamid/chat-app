import express from 'express';
import * as messagesController from '../controllers/messages.controller.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:roomId', authMiddleware, messagesController.getAll);
router.post('/:roomId', authMiddleware, messagesController.createMessage);

export default router;
