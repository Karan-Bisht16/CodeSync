// importing types
import type { User } from '../../types/core.js';
import type { Permissions } from '../types/permissions.js';
// importing roles
import { ROLES } from '../roles/index.js';

export const hasPermission = <Resource extends keyof Permissions>(
    user: User,
    resource: Resource,
    action: Permissions[Resource]['action'],
    data?: Permissions[Resource]['dataType']
) => {
    return user.roles.some(role => {
        const permission = ROLES[role][resource]?.[action];
        if (permission == null) return false;
        return typeof permission === 'boolean' ? permission : permission(user, data!);
    });
};