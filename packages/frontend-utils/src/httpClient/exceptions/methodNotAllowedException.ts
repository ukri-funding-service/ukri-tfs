import { HttpError } from '../..';
import { MethodNotAllowedError } from '../../pageFunctions';

export const methodNotAllowedException = (message: string): HttpError => {
    return new MethodNotAllowedError(message);
};
