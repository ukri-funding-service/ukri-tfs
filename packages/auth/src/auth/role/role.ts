import { RoleType } from './roleType';

export interface Role {
    id: number;
    name: RoleType;
    displayName: string;
    organisationId?: number;
}
