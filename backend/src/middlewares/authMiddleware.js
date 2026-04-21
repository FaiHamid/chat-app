import * as jwtService  from '../services/jwt.service.js';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization || '';
    const [,token] = authorization.split(' ');
    
    if (!token) {
        res.sendStatus(401);
        return;
    }

    const user =  jwtService.verifyAccessToken(token);
    
    if (!user) {
        res.sendStatus(401);
        return;
    }
    console.log('next');
    next();
}