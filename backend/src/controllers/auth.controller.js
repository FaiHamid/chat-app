import * as emailService  from '../services/email.service.js';
import * as userService  from '../services/users.service.js';
import * as jwtService  from '../services/jwt.service.js';
import * as tokenService  from '../services/token.service.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import dotenv from 'dotenv';

dotenv.config();

export const registration = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        res.sendStatus(400);
        return;
    }
    const activationToken = uuidv4();

    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const user = await  userService.createUser(email, name, hashedPassword, activationToken);

    await emailService.sendActionToken(email, activationToken);

    res.send(user)
}

export const activate = async (req, res) => {
    const { activationToken } = req.params;

    const user = await userService.getByActivationCode(activationToken);

    if (!user){
        res.resStatus(404);
        return;
    }

    user.activationToken = null;
    user.save;

    res.send(user);
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.sendStatus(400);
        return;
    }

    const user = await userService.findByEmail(email);
    if (!user){
        res.sendStatus(404);
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid){
        res.sendStatus(400);
        return;
    }

    await generateTokens(res, user);
}

export const refresh = async (req, res) => {
    const { refreshToken } = req.cookies;
    const user = jwtService.verifyRefreshToken(refreshToken);

    if (!user) {
        res.sendStatus(400);
        return;
    }

    await generateTokens(res, user);
}

export const generateTokens = async (res, user) => {
    const normalizedUser = userService.normalizeUser(user);
    const accessToken = await jwtService.generateAccessToken(normalizedUser);
    const refreshToken = await jwtService.generateRefreshToken(normalizedUser);

    res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    })

    res.send({
        user: normalizedUser,
        accessToken
    });
}

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    const payload = jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
        res.sendStatus(401);
        return;
    }

    await tokenService.deleteByUserId(payload.id);
    res.clearCookie('refreshToken', { httpOnly: true });
    res.sendStatus(204);
}
