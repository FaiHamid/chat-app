import * as messagesService from '../services/messages.service.js'
import { getCurrentUser } from '../utils/getCurrentUser.js';

export const getAll = async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        res.sendStatus(400);
        return;
    }

    const allMessages = await messagesService.getAll(roomId);

    res.send(allMessages);
};

export const createMessage = async (req, res) => {
    const { roomId } = req.params;
    const { text } = req.body;

    if (!roomId || !text) {
        res.sendStatus(400);
        return;
    }

    const user = getCurrentUser(req);

    if (!user) {
        res.sendStatus(401);
        return;
    }
    
    const newMessage = await messagesService.createMessage({
        text,
        userId: user.id,
        roomId,
    });

    res.status(201).send(newMessage);
};