export const registerRoomEvents = (io, socket) => {

    socket.on("room:join", (roomId) => {
        socket.join(roomId);

        socket.to(roomId).emit("room:user-joined", {
        userId: socket.user.id,
        roomId,
        });
    });

    socket.on("room:leave", (roomId) => {
        socket.leave(roomId);

        socket.to(roomId).emit("room:user-left", {
        userId: socket.user.id,
        roomId,
        });
    });

    socket.on("room:message", ({ roomId, text }) => {
        io.to(roomId).emit("room:message", {
        roomId,
        text,
        user: {
            id: socket.user.id,
            name: socket.user.name,
        },
        createdAt: new Date(),
        });
    });
};