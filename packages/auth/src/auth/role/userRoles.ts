import { User } from '../user/user';
import { RoleType } from './roleType';

export function userHasRole(user: User, role: RoleType): boolean {
    return !!user && !!user.roles.find(roleToCheck => roleToCheck.name === role);
}

export function userHasRoles(user: User, roles: RoleType[]): boolean {
    return !!roles.find(r => userHasRole(user, r));
}
