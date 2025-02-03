import { HttpError } from '../..';

export const unauthorizedException = (message: string): HttpError => {
    return new HttpError(401, message);
};
