import { Email } from './email';

/* A generic emailer */
export interface AnEmailService<ResponseType> {
    send(email: Email): Promise<ResponseType>;
}
