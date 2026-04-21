import express from 'express';
import * as authController from '../controllers/auth.controller.js'

const router = express.Router();

router.post('/register', authController.registration);
router.get('/activate/:activationToken', authController.activate);
router.post('/login', authController.login);
router.get('/refresh', authController.refresh);
router.post('/logout', authController.logout);


export default router;