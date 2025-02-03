import { WellKnownEndpointKey } from '..';

let wellKnownKeys: WellKnownEndpointKey[];

export async function getWellKnownKeys(url: string): Promise<WellKnownEndpointKey[]> {
    if (!wellKnownKeys) {
        if (!url) {
            return Promise.reject('URL must be provided in order to retrieve well-known keys');
        }

        const response = await fetch(url);
        const jsonResponse = await response.json();

        if (jsonResponse) {
            const keys = jsonResponse.keys as WellKnownEndpointKey[];
            if (keys) {
                wellKnownKeys = keys;
            } else {
                return Promise.reject('Failed to GET well known endpoint keys');
            }
        }
    }
    return wellKnownKeys;
}
