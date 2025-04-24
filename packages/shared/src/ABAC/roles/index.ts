// importing types
import type { RolesWithPermissions } from '../types/permissions.js';
// importing permissions
import { HostPermissions } from './host.role.js';
import { ModeratorPermissions } from './moderator.role.js';
import { UserPermissions } from './user.role.js';

export const ROLES: RolesWithPermissions = {
    host: HostPermissions,
    moderator: ModeratorPermissions,
    user: UserPermissions,
} as const;