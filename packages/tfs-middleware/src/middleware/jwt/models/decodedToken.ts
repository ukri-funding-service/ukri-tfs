import jwt from 'jsonwebtoken';

export type DecodedToken = {
    header: {
        kid?: string | object;
        alg: jwt.Algorithm | undefined;
    };
    payload: string | object;
    signature: unknown;
};
