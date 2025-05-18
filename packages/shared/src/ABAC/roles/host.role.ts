// importing types
import type { RolesWithPermissions } from '../types/permissions.js';

export const HostPermissions: RolesWithPermissions['host'] = {
    users: {
        'kick': (user, target) =>
            target.userID !== user.userID,
        'assign-role': (user, target) =>
            target.userID !== user.userID,
        'more-actions': (user, target) =>
            target.userID !== user.userID,
    },
    rooms: {
        'join': true,
        'lock': true,
        'leave': true,
        'kick': true,
        'assign-role': true,
        'archive': true,
        'host-controls': true,
        'allowRoomLock': true,
        'allowEditLock': true,
        'edit': true,
    },
    // editors: {
    //     'edit': true,
    //     'change-language': true,
    // },
};