// import * as messagesService from "../../services/messages.service.js";

export const typeEvents = {
    sendMessage: async (io, socket, data) => {

        console.log('I`m here')
        socket.to(data.roomId).emit("chat:type", socket.user);
    },
};