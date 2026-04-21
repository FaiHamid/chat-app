import { Server } from "socket.io";
import { socketAuth } from "./middleware/auth.middleware.js";
import { chatEvents } from "./events/chat.event.js";
import { typeEvents } from "./events/type.event.js";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
        origin: "*",
        },
    });

    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("room:join", (roomId) => {
            socket.join(roomId);
        });

        socket.on("chat:message", (data) => {
            chatEvents.sendMessage(io, socket, data);
        });

        socket.on("chat:type", (data) => {
            typeEvents.sendMessage(io, socket, data);
        });
    });

    return io;
};
