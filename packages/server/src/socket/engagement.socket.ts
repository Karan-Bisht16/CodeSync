import { Server, Socket } from 'socket.io';
// importing lib
import { RoomStore } from '../lib/roomStore.js';
// importing types
import type { Message, Room, SocketUser, User } from '@codesync/shared';
// importing utils
import { hasPermission } from '@codesync/shared';

export const handleEngagementEvents = (io: Server, socket: Socket, roomStore: RoomStore) => {
    socket.on('RAISE_HAND', (data: {
        room: Room,
        user: SocketUser,
        handRaised: boolean
    }) => {
        const { user, room, handRaised } = data;
        const roomID = room.roomID;
        const userSocketID = socket.id;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(user, 'rooms', 'join', room)) {
            console.log(`  🔴  ${user.username} shouldn't be in room ${roomID}`);
            return;
        }

        const updatedUser = roomStore.updateUser(userSocketID, { handRaised });
        if (!updatedUser) {
            console.log(`  🔴  ${user.username} update failed in room ${roomID}`);
            return;
        }

        const participants = roomStore.getParticipants(roomID);

        io.to(roomID).emit('HAND_RAISED', {
            updatedUser: { socketID: userSocketID, ...updatedUser },
            updatedParticipants: participants,
        });

        console.log(`  🟢  ${updatedUser.username} raised hand in room ${roomID}`);
    });

    socket.on('MESSAGE_SEND', (data: {
        room: Room,
        message: string,
        sender: User,
        timestamp: number,
        isAnnouncement: boolean,
        countsAsUnread: boolean,
    }) => {
        const { room, message, sender: user, timestamp, isAnnouncement, countsAsUnread } = data;
        const roomID = room.roomID;
        const userSocketID = socket.id;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(user, 'rooms', 'join', room)) {
            console.log(`  🔴  ${user.username} shouldn't be in room ${roomID}`)
            return;
        }

        const newMessage: Message = {
            content: message,
            sender: { socketID: userSocketID, ...user },
            timestamp,
            isAnnouncement,
            countsAsUnread,
        };

        io.to(roomID).emit('MESSAGE_RECEIVE', {
            newMessage
        });

        console.log(`  🟢  ${user.username} sent a message ${roomID}`);
    });

    socket.on('USER_UPDATE_REQUEST', (data: {
        room: Room,
        user: User,
        newUsername: string,
        newUserColor: string,
    }) => {
        const { room, user: oldUser, newUsername, newUserColor } = data;
        const roomID = room.roomID;
        const userSocketID = socket.id;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(oldUser, 'rooms', 'join', room)) {
            console.log(`  🔴  ${oldUser.username} shouldn't be in room ${roomID}`)
            return;
        }

        const updatedUser = roomStore.updateUser(userSocketID, {
            username: newUsername,
            userColor: newUserColor,
        });

        if (!updatedUser) {
            console.log(`  🔴  ${oldUser.username} update failed in room ${roomID}`);
            return;
        }

        const newSocketUser = { socketID: userSocketID, ...updatedUser };
        const participants = roomStore.getParticipants(roomID);

        socket.to(roomID).emit('USER_UPDATED', {
            updatedUser: newSocketUser,
            updatedParticipants: participants,
            isUsernameUpdated: oldUser.username !== newSocketUser.username,
            oldUsername: oldUser.username
        });

        io.to(userSocketID).emit('USER_UPDATE_SUCCESS', {
            updatedUser: newSocketUser,
        });

        console.log(`  🟢  ${newSocketUser.username} was updated in room ${roomID}`);
    });
};