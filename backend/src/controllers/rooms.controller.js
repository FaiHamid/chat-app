import * as roomsService from '../services/rooms.service.js'
import * as roomMembersService from '../services/room-members.service.js'
import { getCurrentUser } from '../utils/getCurrentUser.js';

export const getAll = async (req, res) => {
    const user = getCurrentUser(req);

    const allRooms = await roomsService.getAll(user.id);

    res.send(allRooms);
};

export const createRoom = async (req, res) => {
    const { name } = req.body;
    const user = getCurrentUser(req);

    if (!name || !user) {
        res.sendStatus(400);
        return;
    }

    const newRoom = await roomsService.createRoom(name, user.id)

    res.send(newRoom.inviteCode);
};

export const joinRoom = async (req, res) => {
    const { inviteCode } = req.params;

    if (!inviteCode) {
        res.sendStatus(400);
        return;
    }

    const currentRoom = await roomMembersService.findByInviteCode(inviteCode);

    if (!currentRoom) {
        res.sendStatus(404);
        return;
    }

    const user = getCurrentUser(req);

    if (!user) {
        res.sendStatus(404);
        return;
    }

    await roomMembersService.joinRoom(user.id, currentRoom.id);

    res.sendStatus(200);
};