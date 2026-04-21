import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
        return next(new Error("No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = decoded; // 👈 важливо: прикріплюємо user до socket

        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
};