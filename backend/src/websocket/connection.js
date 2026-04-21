import { chatEvents } from "./chat.events.js";

export const registerChatEvents = (io, socket) => {
    socket.on("chat:message", (data) => {
        chatEvents.sendMessage(io, socket, data);
    });

    socket.on("room:join", (roomId) => {
        socket.join(roomId);
    });
};