/* istanbul ignore file */
export interface Encoder<RawType, EncodedType> {
    encode(payload: RawType): EncodedType;
}

export interface Decoder<RawType, EncodedType> {
    decode(encodedPayload: EncodedType): RawType;
}

export interface Codec<RawType, EncodedType> extends Encoder<RawType, EncodedType>, Decoder<RawType, EncodedType> {}

export class IdentityCodec<T> implements Codec<T, T> {
    encode(payload: T): T {
        return payload;
    }

    decode(encodedPayload: T): T {
        return encodedPayload;
    }
}
