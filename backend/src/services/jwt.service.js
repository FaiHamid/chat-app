import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET,  { expiresIn: '5m' });
}

export const verifyAccessToken = (token) => {
    if (!token || !process.env.JWT_SECRET) {
        return null;
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET,  { expiresIn: '7d' });
}

export const verifyRefreshToken = (token) => {
    if (!token || !process.env.JWT_REFRESH_SECRET) {
        return null;
    }
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
        return null;
    }
};