import { Server, Socket } from 'socket.io';
// importing lib
import { RoomStore } from '../lib/roomStore.js';
// importing types
import type { Role, Room, SocketUser, User } from '@codesync/shared';
// importing utils
import { hasPermission } from '@codesync/shared';

export const handleModerationEvents = (io: Server, socket: Socket, roomStore: RoomStore) => {
    socket.on('CHANGE_ROLE', (data: {
        room: Room,
        actorUser: SocketUser,
        targetUser: SocketUser,
        newRole: Role,
    }) => {
        const { room, actorUser, targetUser, newRole } = data;
        const roomID = room.roomID;
        const targetUserSocketID = targetUser.socketID;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(actorUser, 'rooms', 'join', room)) {
            console.log(`  🔴  ${actorUser.username} shouldn't be in room ${roomID}`)
            return;
        }
        // check if user is authorized to assign a role to target user
        if (!hasPermission(actorUser, 'rooms', 'assign-role') || !hasPermission(actorUser, 'users', 'assign-role', targetUser)) {
            console.log(`  🔴  ${actorUser.username} isn't authorized to assign-role to ${targetUser.username} for room ${roomID}`)
            return;
        }

        const newRoles: Role[] = newRole === 'moderator' ? ['user', 'moderator'] : ['user'];
        const message = newRole === 'moderator'
            ? ` was granted moderator role`
            : `'s moderator role was revoked`;

        const updatedTargetUser = roomStore.updateUser(targetUserSocketID, {
            roles: newRoles,
        });

        if (!updatedTargetUser) {
            console.log(`  🔴  ${targetUser.username} update failed in room ${roomID}`);
            return;
        }

        const participants = roomStore.getParticipants(roomID);

        io.to(roomID).emit('ROLE_CHANGED', {
            newUser: { socketID: targetUserSocketID, ...updatedTargetUser },
            updatedParticipants: participants,
            broadcastMessage: `${updatedTargetUser.username}${message} by ${actorUser.username}`,
            personalMessage: `You are now a ${newRole}`,
        });

        console.log(`  🟢  ${updatedTargetUser.username} role was changed to ${newRole} in room ${roomID}`);
    });

    socket.on('KICK_USER', (data: {
        room: Room,
        actorUser: User,
        targetUser: SocketUser,
    }) => {
        const { room, actorUser, targetUser } = data;
        const roomID = room.roomID;
        const actorUserSocketID = socket.id;
        const targetUserSocketID = targetUser.socketID;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(actorUser, 'rooms', 'join', room)) {
            console.log(`  🔴  ${actorUser.username} shouldn't be in room ${roomID}`)
            return;
        }
        // check if user is authorized to kick target user
        if (!hasPermission(actorUser, 'rooms', 'kick') || !hasPermission(actorUser, 'users', 'kick', targetUser)) {
            console.log(`  🔴  ${actorUser.username} isn't authorized to kick ${targetUser.username} from room ${roomID}`)
            return;
        }

        roomStore.removeUser(targetUserSocketID);

        // notify everyone to remove caret of disconnected user
        socket.to(roomID).emit('SYNC_CARET_POSITION', {
            user: targetUser,
            offset: -1,
            userDisconnected: true,
        });

        const participants = roomStore.getParticipants(roomID);
        targetUser.admittedRooms = (targetUser.admittedRooms ?? []).filter(
            (admittedRoom) => admittedRoom !== roomID
        );

        io.to(roomID).emit('USER_KICKED', {
            updatedParticipants: participants,
            kickedUser: targetUser,
            actorUser: { socketID: actorUserSocketID, ...actorUser },
        });

        console.log(`  🟢  ${targetUser.username} kicked from room ${roomID} by ${actorUser.username}`);
    });
};