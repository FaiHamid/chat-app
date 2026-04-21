import * as userService from '../services/users.service.js'
import * as jwtService from '../services/jwt.service.js'
import { getCurrentUser } from '../utils/getCurrentUser.js';

export const getAll = async (req, res) => {
    const allUsers = await userService.getAll();
    const normalizedUsers = allUsers.map(user => userService.normalizeUser(user));
    res.send(normalizedUsers);
};

export const getByToken = async (req, res) => {
    const currentUser = getCurrentUser(req);
    
    if (!currentUser) {
        res.sendStatus(401);
        return;
    }
    
    res.send(userService.normalizeUser(currentUser));    
};