import { IncomingMessage } from 'http';
import { WellKnownEndpointKey, WellKnownEndpointKeysAccessor } from './wellKnownKeys';

export type RawTokenExtractor = { extract: (req: IncomingMessage) => string | undefined };

export type ClaimsVerifier = { verify: (payload: object | string, requiredClaims: string[]) => Promise<void> };

export type VerifyJwtMiddlewareOptions = {
    requiredClaims: string[];
    wellKnownEndpoint: string;
    rawTokenExtractor: RawTokenExtractor;
    keysAccessor: WellKnownEndpointKeysAccessor;
    claimsVerifier: ClaimsVerifier;
};

export class NullVerifyJwtMiddlewareOptions implements VerifyJwtMiddlewareOptions {
    public requiredClaims: string[] = [];
    wellKnownEndpoint = 'NULL';
    rawTokenExtractor = { extract: (): string | undefined => undefined };
    keysAccessor = {
        retrieve: (): Promise<WellKnownEndpointKey[]> => Promise.resolve([]),
    };
    claimsVerifier = { verify: (): Promise<void> => Promise.resolve() };
}
