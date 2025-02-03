import { User } from '..';

export interface UserData {
    userId?: string;
    user: Promise<User | undefined>;
}
