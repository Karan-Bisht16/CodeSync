import { Server, Socket } from 'socket.io';
import { ChangeSet } from '@codemirror/state';
// importing lib
import { RoomStore } from '../lib/roomStore.js';
// importing types
import type { Update } from '@codemirror/collab';
import type { Room, User } from '@codesync/shared';
// importing utils
import { hasPermission } from '@codesync/shared';

export const handleEditorEvents = (io: Server, socket: Socket, roomStore: RoomStore) => {
    // Handle participants requesting the full document
    socket.on('GET_DOCUMENT', (data: {
        room: Room,
        user: User,
    }) => {
        const { room, user } = data;
        const roomID = room.roomID;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(user, 'rooms', 'join', room)) {
            console.log(`  🔴  ${user.username} shouldn't be in room ${roomID}`)
            return;
        }

        // Send the current document state
        const document = roomStore.getRoomDoc(roomID);
        if (!document) {
            console.log(`  🔴  No document found for room ${roomID}`)
            return;
        }

        socket.emit('DOCUMENT_RECEIVED', {
            version: document.updates.length,
            doc: document.doc.toString(),
        });

        console.log(`  🟢  Document sent to ${user.username} for room ${roomID}, ver: ${document.updates.length}`)
    });

    // Handle document updates from participants
    socket.on('PUSH_UPDATES', (data: {
        version: number,
        updates: string,
        room: Room,
        user: User,
    }) => {
        const { version, updates, room, user } = data;
        const roomID = room.roomID;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(user, 'rooms', 'join', room)) {
            console.log(`  🔴  ${user.username} shouldn't be in room ${roomID}`)
            return;
        }

        // Send the current document state
        const document = roomStore.getRoomDoc(roomID);
        if (!document) {
            console.log(`  🔴  No document found for room ${roomID}`)
            return;
        }

        try {
            // Version check to ensure consistency
            if (version !== document.updates.length) {
                socket.emit('PUSH_UPDATES_RESPONSE', false);
                // console.log(`  🔴  Version mismatch: participant ${version}, server ${document.updates.length}`);
                return;
            }

            const docUpdates = JSON.parse(updates);
            const newUpdates: Update[] = [];
            let newDoc = document.doc;

            // Apply updates to the document
            for (const update of docUpdates) {
                const changes = ChangeSet.fromJSON(update.changes);
                newUpdates.push({
                    changes,
                    clientID: update.clientID,
                });
                newDoc = changes.apply(newDoc);
            }

            roomStore.updateRoomDoc(roomID, {
                updates: [...document.updates, ...newUpdates],
                doc: newDoc,
            });

            socket.emit('PUSH_UPDATES_RESPONSE', true);

            // Notify pending participants waiting for updates
            while (document.pending.length) {
                const callback = document.pending.pop();
                if (callback) {
                    callback([...document.updates, ...newUpdates]);
                }
            }

            // console.log(`  🟢  Updates applied to room ${roomID}, new version: ${document.updates.length}`);
        } catch (error) {
            console.error(`  🔴  Error processing updates for room ${roomID}:`, error);
            socket.emit('pushUpdateResponse', false);
        }
    });

    // Handle participants requesting updates
    socket.on('PULL_UPDATES', (data: {
        version: number,
        room: Room,
        user: User,
    }) => {
        const { version, room, user } = data;
        const roomID = room.roomID;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(user, 'rooms', 'join', room)) {
            console.log(`  🔴  ${user.username} shouldn't be in room ${roomID}`)
            return;
        }

        // Send the current document state
        const document = roomStore.getRoomDoc(roomID);
        if (!document) {
            console.log(`  🔴  No document found for room ${roomID}`)
            return;
        }

        // if user is behind, send them the updates
        if (version < document.updates.length) {
            const updates = document.updates.slice(version);
            socket.emit('PULL_UPDATES_RESPONSE', JSON.stringify(updates));
            // console.log(`  🟢  Sent ${updates.length} updates to ${user.username} in room ${roomID}`);
        } else {
            // Otherwise, add to pending list to notify later
            document.pending.push((updates) => {
                socket.emit('PULL_UPDATES_RESPONSE', JSON.stringify(updates.slice(version)));
            });
            // console.log(`  🔴  ${user.username} waiting for updates beyond version ${version} in room ${roomID}`);
        }
    });

    socket.on('CARET_MOVED', (data: {
        room: Room,
        user: User,
        offset: number,
    }) => {
        const { room, user, offset } = data;
        const roomID = room.roomID;
        const userSocketID = socket.id;

        if (!roomStore.isRoomActive(roomID) || !hasPermission(user, 'rooms', 'join', room)) {
            console.log(`  🔴  ${user.username} shouldn't be in room ${roomID}`)
            return;
        }

        socket.to(roomID).emit('SYNC_CARET_POSITION', {
            user: { socketID: userSocketID, ...user },
            offset: offset,
        });
    });

};