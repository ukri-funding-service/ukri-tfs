import { IncomingMessage } from 'http';

function firstValueOfArrayOrString(items?: string | string[]): string | undefined {
    return items instanceof Array ? items.find((_value, index) => index === 0) : items;
}

export function firstHeaderValue(req: IncomingMessage, headerName: string): string | undefined {
    return firstValueOfArrayOrString(req.headers[headerName] || req.headers[headerName.toLowerCase()]);
}
