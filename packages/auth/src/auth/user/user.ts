import { Policy } from '../policy';
import { Role } from '../role';

export interface User {
    id: number;
    tfsId: string;
    cognitoId: string;
    personId?: number;
    displayName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles: Role[];
    policies?: Policy[];
}
