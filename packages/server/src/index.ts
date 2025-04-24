import 'dotenv/config';
import * as http from 'http';
import { Socket } from 'socket.io';
// importing config
import app from './config/express.config.js';
import { configureSocketIO } from './config/socket.io.config.js';
// importing lib
import { RoomStore } from './lib/roomStore.js';
// importing socket event handlers
import { handleEditorEvents } from './socket/editor.socket.js';
import { handleEngagementEvents } from './socket/engagement.socket.js';
import { handleModerationEvents } from './socket/moderation.socket.js';
import { handleRoomEvents } from './socket/room.socket.js';
import { handleSessionEvents } from './socket/session.socket.js';

const server = http.createServer(app);
const io = configureSocketIO(server);

const roomStore = new RoomStore();

// TODO: should do isValidUser, isValidRoom in every event
io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    handleSessionEvents(io, socket, roomStore);
    handleEditorEvents(io, socket, roomStore);
    handleEngagementEvents(io, socket, roomStore);
    handleModerationEvents(io, socket, roomStore);
    handleRoomEvents(io, socket, roomStore);
});

import rootRoutes from './routes/root.routes.js';
app.use(rootRoutes);
import codeOperationRoutes from './routes/codeOperation.routes.js';
app.use('/codeOperation', codeOperationRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});