// importing types
import type { RolesWithPermissions } from '../types/permissions.js';

export const UserPermissions: RolesWithPermissions['user'] = {
    users: {
        'kick': false
    },
    rooms: {
        'join': (user, room) =>
            (room.joinPolicy !== 'locked' || user.admittedRooms?.includes(room.roomID) === true) &&
            !user.blockedBy?.some((block) => block.hostID === room.hostID && block.roomID === room.roomID),
        'leave': true,
    },
    editors: {
        'edit': (user, editor) =>
            editor.editPolicy === 'everyone' ||
            (editor.editPolicy === 'custom' && editor.customEditors?.includes(user.userID) === true),
        'change-language': (user, editor) =>
            editor.editPolicy === 'everyone' ||
            (editor.editPolicy === 'custom' && editor.customEditors?.includes(user.userID) === true),
    },
};