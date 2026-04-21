import './config.js';
import express from 'express';
import http from 'http';
import cors from 'cors';
import authRouter  from './routes/auth.route.js';
import userRouter  from './routes/users.route.js';
import roomsRouter  from './routes/rooms.route.js';
import messagesRouter from './routes/messages.route.js';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import { initSocket } from './websocket/index.js';


dotenv.config();

const PORT =  process.env.PORT || 8000;

const app = express();


var corsOptions = {
    origin: process.env.CLIENT_HOST,
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use('/users', userRouter);
app.use('/rooms',  roomsRouter);
app.use('/messages', messagesRouter);

app.use(errorMiddleware);

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

