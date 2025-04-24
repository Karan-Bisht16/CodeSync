// importing types
import type { RolesWithPermissions } from '../types/permissions.js';

export const ModeratorPermissions: RolesWithPermissions['moderator'] = {
    users: {
        'kick': (user, target) =>
            !target.roles?.includes('host') &&
            target.userID !== user.userID,
        'assign-role': (user, target) =>
            !target.roles?.includes('host') &&
            target.userID !== user.userID,
        'more-actions': (user, target) =>
            !target.roles?.includes('host') &&
            target.userID !== user.userID,
    },
    rooms: {
        'join': true,
        'lock': true,
        'leave': true,
        'kick': true,
        'host-controls': (_user, room) =>
            room.allowModeratorsRoomLock || room.allowModeratorsEditLock,
        'allowRoomLock': (_user, room) =>
            room.allowModeratorsRoomLock,
        'allowEditLock': (_user, room) =>
            room.allowModeratorsEditLock,
    },
    editors: {
        'edit': (user, editor) =>
            editor.editPolicy === 'everyone' ||
            editor.editPolicy === 'host-and-moderators' ||
            (editor.editPolicy === 'custom' && editor.customEditors?.includes(user.userID) === true),
        'change-language': (user, editor) =>
            editor.editPolicy === 'everyone' ||
            editor.editPolicy === 'host-and-moderators' ||
            (editor.editPolicy === 'custom' && editor.customEditors?.includes(user.userID) === true),
    },
};