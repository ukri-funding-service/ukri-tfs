import { HttpError } from '../..';
import { ForbiddenError } from '../../pageFunctions';

export const forbiddenException = (message: string): HttpError => {
    return new ForbiddenError(message);
};
