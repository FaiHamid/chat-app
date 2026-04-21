import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getAll = async (roomId) => {
    const where = {};

    if (roomId) {
        where.roomId = roomId;
    }

    return await Message.findAll({
        where,
        include: [
            {
                model: User,
                attributes: ["id", "name"],
            },
        ],
        order: [["createdAt", "ASC"]],
    });
}

export const createMessage = async (data) => {
    const createdMessage = await Message.create(data);

    return await Message.findByPk(createdMessage.id, {
        include: [
            {
                model: User,
                attributes: ["id", "name"],
            },
        ],
    });
}
