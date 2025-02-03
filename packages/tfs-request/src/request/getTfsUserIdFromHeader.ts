import { IncomingMessage } from 'http';
import { firstHeaderValue } from './firstHeaderValue';

const userIdHeaderName = 'x-tfsuserid';

export function getTfsUserIdFromHeader(req: IncomingMessage): string | undefined {
    return firstHeaderValue(req, userIdHeaderName);
}
