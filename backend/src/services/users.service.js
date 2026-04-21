import { Token } from "../models/token.model.js";
import { User } from "../models/user.model.js";

export const createUser = async (email, name, password, activationToken) => {
    return await User.create({email, name, password, activationToken})
}

export const getByActivationCode = async (activationToken) => {
    return await User.findOne({ where: { activationToken } });
}

export const getByRefreshToken = async (refreshToken) => {
    return await User.findOne({
        include: [{
            model: Token,
            where: { refreshToken }
        }]
    });
}

export const findByEmail = async (email) => {
    return await User.findOne({ where: { email } });
}

export const getAll = async () => {
    return await User.findAll();
}

export const normalizeUser = ({email, id, name}) => {
    return { email, id, name };
}