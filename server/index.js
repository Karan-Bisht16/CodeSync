const cors = require("cors");
const http = require("http");
// const path = require("path");
const express = require("express");
const app = express();
const { Server } = require("socket.io");
const ACTIONS = require("./constants/Actions");

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
}));

const io = new Server(server);

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId].username,
                userColor: userSocketMap[socketId].userColor,
            };
        }
    );
};

io.on("connection", (socket) => {
    console.log(`Socket connected with id: ${socket.id}`);
    socket.on(ACTIONS.JOIN, ({ roomId, username, userColor }) => {
        userSocketMap[socket.id] = { username, userColor };
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        // notify that new user join
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                socketId: socket.id,
                username,
                userColor,
            });
        });
    });

    // sync the code
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message }) => {
        socket.in(roomId).emit(ACTIONS.SEND_MESSAGE, { message });
    });
    // when new user join the room all the code which are there are also shows on that persons editor
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    // leave room
    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        // leave all the room
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id]?.username,
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

app.get("/pingServer", (req, res) => {
    return res.status(200).json(true);
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));