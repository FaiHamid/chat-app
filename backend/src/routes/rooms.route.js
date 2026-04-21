import express from 'express';
import * as roomsController from '../controllers/rooms.controller.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roomsController.getAll);
router.post('/', authMiddleware, roomsController.createRoom);
router.post('/join/:inviteCode', authMiddleware, roomsController.joinRoom);

export default router;