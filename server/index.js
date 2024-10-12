const cors = require("cors");
const http = require("http");
const axios = require("axios");
require("dotenv").config();
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
app.use(express.json());

const io = new Server(server);

const userSocketMap = {};
const getAllConnectedClients = (roomID) => {
    return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
        (socketID) => {
            return {
                socketID,
                username: userSocketMap[socketID].username,
                userColor: userSocketMap[socketID].userColor,
                handRaised: userSocketMap[socketID].handRaised,
            };
        }
    );
};

io.on("connection", (socket) => {
    console.log(`Socket connected with id: ${socket.id}`);
    socket.on(ACTIONS.JOIN, ({ roomID, username, userColor }) => {
        userSocketMap[socket.id] = { username, userColor, handRaised: false };
        socket.join(roomID);
        const clients = getAllConnectedClients(roomID);
        // notify that new user join
        clients.forEach(({ socketID }) => {
            io.to(socketID).emit(ACTIONS.JOINED, {
                clients,
                socketID: socket.id,
                username,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomID, code }) => {
        socket.in(roomID).emit(ACTIONS.CODE_CHANGE, { code });
    });
    socket.on(ACTIONS.CURSOR_MOVED, ({ socketID, roomID, username, userColor, line, ch }) => {
        socket.in(roomID).emit(ACTIONS.CURSOR_MOVED, { socketID, username, userColor, line, ch });
    });
    socket.on(ACTIONS.SEND_MESSAGE, ({ roomID, message }) => {
        socket.in(roomID).emit(ACTIONS.SEND_MESSAGE, { message });
    });
    // update for multi-user typing
    socket.on(ACTIONS.SYNC_CODE, ({ socketID, code }) => {
        io.to(socketID).emit(ACTIONS.CODE_CHANGE, { code });
    });
    socket.on(ACTIONS.TYPING, ({ socketID, roomID, username }) => {
        socket.in(roomID).emit(ACTIONS.TYPING, { socketID, username });
    });
    socket.on(ACTIONS.RAISE_HAND, ({ socketID, roomID, clients, handRaised }) => {
        const updatedClients = clients.map((client) => {
            if (client.socketID === socketID) {
                client.handRaised = !handRaised;
                userSocketMap[client.socketID].handRaised = !handRaised;
            }
            return client;
        });
        io.to(roomID).emit(ACTIONS.RAISE_HAND, { updatedClients });
    });
    // leave room
    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        const username = userSocketMap[socket.id]?.username;
        delete userSocketMap[socket.id];
        const updatedClients = [];
        for (const socketID in userSocketMap) {
            const newObj = {
                socketID: socketID,
                username: userSocketMap[socketID].username,
                userColor: userSocketMap[socketID].userColor,
                handRaised: userSocketMap[socketID].handRaised,
            }
            updatedClients.push(newObj);
        }
        // leave all the room
        rooms.forEach((roomID) => {
            socket.in(roomID).emit(ACTIONS.DISCONNECTED, {
                username: username,
                updatedClients,
            });
            socket.in(roomID).emit(ACTIONS.CURSOR_MOVED, { socketID: socket.id, left: true });
        });
        socket.leave();
    });
});

app.get("/pingServer", (req, res) => {
    return res.status(200).json(true);
});

app.post("/executeCode", async (req, res) => {
    const { LanguageChoice, Program, Input } = req.body;

    const encodedParams = new URLSearchParams();
    encodedParams.append("LanguageChoice", LanguageChoice);
    encodedParams.append("Program", Program);
    encodedParams.append("Input", Input);

    const options = {
        method: "POST",
        url: "https://code-compiler.p.rapidapi.com/v2",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-RapidAPI-Key": process.env.CODE_COMPILER_API_KEY,
            "X-RapidAPI-Host": "code-compiler.p.rapidapi.com",
        },
        data: encodedParams,
    };
    try {
        const response = await axios.request(options);
        let message = response.data.Result;
        let error = false;
        if (message === null) {
            message = response.data.Errors;
            error = true;
        }
        return res.status(200).json({ message, error });
    } catch (error) {
        let message;
        if (error.status === 504 && error?.response?.statusText === "Gateway Time-out") {
            message = "Timeout exception. Check your code.";
        } else {
            message = "Something went wrong, Please check your code and input.";
        }
        return res.status(200).json({ message, error: true });
    }
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));