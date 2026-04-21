import { RoomMember } from "../models/room-member.model.js";
import { Room } from "../models/room.model.js";

export const findByInviteCode = async (inviteCode) => {
    return await Room.findOne({ where: { inviteCode } });
}

export const joinRoom = async (userId, roomId, options = {}) => {
    return await RoomMember.create({ userId, roomId }, options);
}