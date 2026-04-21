import express from 'express';
import * as userController  from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, userController.getAll);
router.get('/current', authMiddleware, userController.getByToken);


export default router;