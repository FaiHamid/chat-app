import { Token } from "../models/token.model.js"

export const save = async (userId, refreshToken) => {
    const token = await Token.findOne({ where: { userId }});

    if (!token) {
        await Token.create({ userId, refreshToken });
        return;
    }

    token.refreshToken = refreshToken;
    return await token.save();
}

export const getByToken = async (refreshToken) => {
    return await Token.findOne({ where: { refreshToken }});
}

export const deleteByUserId = async (userId) => {
    return await Token.destroy({ where: { userId }});
}