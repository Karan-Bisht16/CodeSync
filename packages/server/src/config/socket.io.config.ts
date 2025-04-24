import { Server } from 'socket.io';
import * as http from 'http';
// importing config
import { corsOptions } from './cors.config.js';

export const configureSocketIO = (server: http.Server) => {
    return new Server(server, {
        cors: {
            origin: corsOptions.origin,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
        },
    });
};