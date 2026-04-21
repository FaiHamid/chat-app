export const registerAuthEvents = (io, socket) => {

    socket.emit("auth:me", {
        user: socket.user,
    });

    socket.on("auth:ping", () => {
        socket.emit("auth:pong", {
        status: "ok",
        });
    });
};