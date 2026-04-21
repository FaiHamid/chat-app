import * as jwtService from '../services/jwt.service.js';

export const getCurrentUser = (req) => {
    const authorization = req.headers.authorization || '';
    const [,token] = authorization.split(' ');
    
    if (!token) {
        return null;
    }

    const user =  jwtService.verifyAccessToken(token);
    
    if (!user) {
        return null;
    }

    return user;
}