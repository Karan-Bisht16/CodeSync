// importing types
import type { RolesWithPermissions } from '../types/permissions.js';

export const UserPermissions: RolesWithPermissions['user'] = {
    users: {
        'kick': false
    },
    rooms: {
        'join': (user, room) =>
            user.admittedRooms?.includes(room.roomID) === true &&
            !user.blockedBy?.some((block) => block.hostID === room.hostID && block.roomID === room.roomID),
        'leave': true,
        'edit': (_user, room) => room.editPolicy === 'everyone',
    },
    // editors: {
    //     'edit': (_user, editor) => editor.editPolicy === 'everyone',
    //     'change-language': (user, editor) => editor.editPolicy === 'everyone',
    // },
};