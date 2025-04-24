import { Server, Socket } from 'socket.io';
// importing lib
import { RoomStore } from '../lib/roomStore.js';
// importing types
import type { Room, SocketUser, User } from '@codesync/shared';

export const handleSessionEvents = (io: Server, socket: Socket, roomStore: RoomStore) => {
    // Handle user's session being initialized
    socket.on('INITIALIZE_SESSION', (data: {
        roomID: string,
        newUser: User,
    }) => {
        const { roomID, newUser } = data;
        const userSocketID = socket.id;
        // every user will have atleast 'user' role
        newUser.roles = ['user'];

        // if user is already in room then skip rest 
        if (roomStore.isUserInRoom(userSocketID, roomID)) {
            console.log(`  🔴  ${newUser.username}'s session has already been intialized for room ${roomID}`);
            return;
        }

        // if room doesn't exist then make add role of 'host' to this user
        const doesRoomExists = roomStore.isRoomActive(roomID);

        // create new room or get existing one
        const room = roomStore.createRoom({
            roomID,
            hostID: userSocketID,
            joinPolicy: 'open',
            createdAt: Date.now(),
            allowModeratorsRoomLock: false,
            allowModeratorsEditLock: false,
        });

        if (doesRoomExists) {
            const previousRoles = roomStore.getPreviousRole(roomID, newUser.userID);

            // these roles will be deleted when the room is empty
            if (previousRoles) {
                newUser.roles = previousRoles;
            }
            const initializedUser = { socketID: userSocketID, ...newUser };

            // if previously the user had the role of host then admit them without permission
            if (previousRoles?.includes('host')) {
                const lastHostID = room.hostID;
                const lastHost = roomStore.getUser(lastHostID);
                if (lastHost) {
                    lastHost.roles = lastHost.roles.filter((role) => {
                        return role !== 'host';
                    });
                }

                roomStore.updateRoomMetadata(roomID, { hostID: userSocketID });

                roomStore.addUser(roomID, userSocketID, newUser);
                socket.join(roomID);

                const participants = roomStore.getParticipants(roomID);

                io.to(userSocketID).emit('HOST_SESSION_INITIALIZED', {
                    initializedUser,
                    participants,
                    room,
                });

                // notify everyone that the host has returned
                io.to(roomID).emit('ROLE_CHANGED', {
                    newUser,
                    updatedParticipants: participants,
                    broadcastMessage: `${newUser.username} is back and is now the host`,
                    personalMessage: `${newUser.username}, you have been restored as the host`,
                });

                console.log(`  🟢  ${initializedUser.username} is back and now the host for room ${roomID}`);
                return;
            }
            // TODO: As for other roles, their should be a setting within room based in which re-join should be checked
            // so, allowRejoin: 'everyone' | 'host-only' | 'host-and-moderators'

            // notify host about this new user if room is open
            if (room.joinPolicy === 'open') {
                io.to(room.hostID).emit('USER_JOIN_REQUESTED', {
                    newUser: initializedUser,
                });
            }

            io.to(userSocketID).emit('SESSION_INITIALIZED', {
                initializedUser,
                room,
            });

            console.log(`  🟢  ${initializedUser.username}'s session has been intialized for room ${roomID}`);
            console.log(`  🟢  ${initializedUser.username} waiting for response of host of room ${roomID}`);
        } else {
            // user has created a new room; -> host
            newUser.roles.push('host');
            // add host to room; avoid duplicates
            if (!newUser.admittedRooms?.includes(roomID)) {
                newUser.admittedRooms = [...(newUser.admittedRooms || []), roomID];
            }
            roomStore.addUser(roomID, userSocketID, newUser);
            socket.join(roomID);

            const initializedUser = { socketID: userSocketID, ...newUser };
            const participants = roomStore.getParticipants(roomID);

            io.to(userSocketID).emit('HOST_SESSION_INITIALIZED', {
                initializedUser,
                participants,
                room,
            });
            console.log(`  🟢  ${initializedUser.username} created a new room ${roomID}`);
            console.log(`  🟢  ${initializedUser.username} is host for room ${roomID}`);
        }
    });

    // Handle user's join request
    socket.on('RESOLVE_JOIN_REQUEST', (data: {
        room: Room,
        user: SocketUser,
        accept: boolean
    }) => {
        const { user, room, accept } = data;
        const userSocketID = user.socketID;
        const roomID = room.roomID;

        if (accept) {
            // add user to room
            if (!user.admittedRooms?.includes(roomID)) {
                user.admittedRooms = [...(user.admittedRooms || []), roomID];
            }

            // notify new user that they have been admitted into room
            io.to(userSocketID).emit('JOIN_REQUEST_RESPONSE', {
                user,
                accept,
                room,
            });
            console.log(`  🟢  ${user.username}'s join request was accpeted for room ${roomID}`);
        } else {
            // TODO: store this on client side for proper blocked by
            // at the moment this piece of code doesn't do anything
            // the reason for request rejected modal is 'accept' flag not this modification
            user.blockedBy = [...(user.blockedBy || []), { roomID, hostID: room.hostID }];

            io.to(userSocketID).emit('JOIN_REQUEST_RESPONSE', {
                user,
                accept,
            });
            console.log(`  🟢  ${user.username}'s join request was rejected for room ${roomID}`);
        }
        io.to(room.hostID).emit('USER_REQUEST_PROCESSED', {
            user
        })
    });

    // Handle user's joining
    socket.on('JOIN', (data: {
        room: Room,
        newUser: User,
    }) => {
        const { newUser, room } = data;
        const userSocketID = socket.id
        const roomID = room.roomID;

        // if user is already in room then skip rest 
        if (roomStore.isUserInRoom(userSocketID, roomID)) {
            console.log(`  🔴  ${newUser.username} already joined room ${roomID}`);
            return;
        }

        roomStore.addUser(roomID, userSocketID, newUser);
        socket.join(roomID);

        const participants = roomStore.getParticipants(roomID);
        const joinedUser = { socketID: userSocketID, ...newUser };

        // notify everyone that a new user has been admitted into room
        io.to(roomID).emit('JOINED', {
            updatedParticipants: participants,
            joinedUser,
            room,
        });

        console.log(`  🟢  ${newUser.username}'s joined room ${roomID}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const userSocketID = socket.id;
        const roomID = roomStore.getRoomIDForSocket(userSocketID);
        console.log(roomID);
        const user = roomStore.getUser(userSocketID);
        console.log(user);
        // The issue with 'blocked by' is that it is only stored on client side 
        // so if user refreshes the page then thier will be no blocked by
        // thus the request will go back to the host
        // to solve this we could store the blocked by in DB (or atm in just a DS on server side) 
        // and then if a user is trying to join a room we can cross check their authorization
        if (!roomID || !user) return;

        roomStore.removeUser(userSocketID);
        const disconnectedUser = { socketID: userSocketID, ...user };

        // notify everyone to remove caret of disconnected user
        socket.to(roomID).emit('CURSOR_MOVED', {
            user: disconnectedUser,
            offset: -1,
            userDisconnected: true,
        });

        const participants = roomStore.getParticipants(roomID);
        io.to(roomID).emit('DISCONNECTED', {
            updatedParticipants: participants,
            disconnectedUser,
        });

        console.log(`  👋  ${disconnectedUser.username} left room ${roomID}`);

        // if the user who left was the host then make someone else the host
        if (user.roles?.includes('host') && participants.length > 0) {
            const newHost = roomStore.getNewHost(roomID);
            const newHostSocketID = newHost.socketID;
            newHost.roles.push('host');

            roomStore.updateRoomMetadata(roomID, { hostID: newHostSocketID });
            const updatedParticipants = roomStore.getParticipants(roomID);

            io.to(roomID).emit('ROLE_CHANGED', {
                newUser: newHost,
                updatedParticipants,
                broadcastMessage: `${user.username} left, ${newHost.username} is now the host`,
                personalMessage: `${user.username} left, you are now the host`,
            });

            console.log(`  🟢  ${newHost.username} is now the host of room ${roomID}`);
        }

        if (participants.length === 0) {
            console.log(`Room ${roomID} is now empty and cleaned up`);
        }
    });
};