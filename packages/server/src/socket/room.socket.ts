import { Server, Socket } from 'socket.io';
// importing lib
import { RoomStore } from '../lib/roomStore.js';
// importing types
import type { Room, User } from '@codesync/shared';
// importing utils
import { hasPermission } from '@codesync/shared';

export const handleRoomEvents = (io: Server, socket: Socket, roomStore: RoomStore) => {
    socket.on('UPDATE_ROOM_SETTINGS', (data: {
        room: Room,
        actorUser: User,
        settings: Partial<Room>,
    }) => {
        const { room, actorUser, settings } = data;
        const userSocketID = socket.id;
        const roomID = room.roomID;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(actorUser, 'rooms', 'join', room)) {
            console.log(`  🔴  ${actorUser.username} shouldn't be in room ${roomID}`)
            return;
        }
        if (!hasPermission(actorUser, 'rooms', 'host-controls')) {
            console.log(`  🔴  ${actorUser.username} isn't authorized to perform host-controls operations in room ${roomID}`)
            return;
        }

        roomStore.updateRoomMetadata(roomID, settings);
        const updatedRoom = roomStore.getRoomMetadata(roomID);
        if (!updatedRoom) {
            console.log(`  🔴  Update room failed for room ${roomID}`)
        }

        io.to(roomID).emit('ROOM_SETTINGS_UPDATED', {
            updatedRoom,
            actorUser: { socketID: userSocketID, ...actorUser },
        });

        console.log(`  🟢  ${actorUser.username} performed host-controls operations in room ${roomID}`);
    });
};