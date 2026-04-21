import * as messagesService from "../../services/messages.service.js";

export const chatEvents = {
    sendMessage: async (io, socket, data) => {

        const message = await messagesService.createMessage({
        roomId: data.roomId,
        userId: socket.user.id,
        text: data.text,
        });

        io.to(data.roomId).emit("chat:message", message);
    },
};