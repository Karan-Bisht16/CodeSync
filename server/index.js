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
    socket.on(ACTIONS.JOIN, ({ roomID, username, userColor }) => {
        userSocketMap[socket.id] = { username, userColor };
        socket.join(roomID);
        const clients = getAllConnectedClients(roomID);
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
    socket.on(ACTIONS.CODE_CHANGE, ({ roomID, code }) => {
        socket.in(roomID).emit(ACTIONS.CODE_CHANGE, { code });
    });
    socket.on(ACTIONS.SEND_MESSAGE, ({ roomID, message }) => {
        socket.in(roomID).emit(ACTIONS.SEND_MESSAGE, { message });
    });
    // when new user join the room all the code which are there are also shows on that persons editor
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    // leave room
    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        // leave all the room
        rooms.forEach((roomID) => {
            socket.in(roomID).emit(ACTIONS.DISCONNECTED, {
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