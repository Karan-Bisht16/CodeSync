// importing types
import { Editor, Role, Room, User } from './core.js';

export type PermissionCheck<Key extends keyof Permissions> =
    | boolean
    | ((user: User, data: Permissions[Key]['dataType']) => boolean);

export type Permissions = {
    users: {
        dataType: User,
        action: 'more-actions' | 'kick' | 'assign-role'
    },
    rooms: {
        dataType: Room,
        action: 'join' | 'lock' | 'leave' | 'kick' | 'assign-role' | 'host-controls' | 'allowRoomLock' | 'allowEditLock' | 'archive',
    },
    editors: {
        dataType: Editor,
        action: 'edit' | 'change-language',
    },
};

export type RolesWithPermissions = {
    [R in Role]: Partial<{
        [Key in keyof Permissions]: Partial<{
            [Action in Permissions[Key]['action']]: PermissionCheck<Key>
        }>
    }>
};