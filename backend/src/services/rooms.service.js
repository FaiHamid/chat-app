import { RoomMember } from "../models/room-member.model.js";
import { Room } from "../models/room.model.js";
import { sequelize } from "../db.js";
import * as roomMembersService from "./room-members.service.js";

export const getAll = async (userId) => {
    return await Room.findAll({
        include: [
        {
            model: RoomMember,
            where: { userId },
            attributes: [],
        },
        ],
    });
};


export const createRoom = async (name, userId) => {
    return await sequelize.transaction(async (transaction) => {
        const room = await Room.create({ name }, { transaction });

        await roomMembersService.joinRoom(userId, room.id, { transaction });

        return room;
    });
};