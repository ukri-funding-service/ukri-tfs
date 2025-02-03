import * as crypto from 'crypto';
import { ParsedUrlQuery, stringify } from 'querystring';
import { parse as parseUrl } from 'url';

const algorithm = 'aes-256-gcm';
const keySize = 32;
const ivSize = 16;
const dataPrefix = 'data::';

const getKeyBuffer = (key: string): Buffer => {
    const keyBuffer = Buffer.from(key || '');

    if (keyBuffer.length !== keySize) {
        throw new Error(`The encryption key must be a ${keySize} character string`);
    }
    return keyBuffer;
};

export const encryptData = <T>(data: T, key: string): { ivHex: string; encryptedDataHex: string; authTag: string } => {
    const keyBuffer = getKeyBuffer(key);
    const ivBuffer = crypto.randomBytes(ivSize);
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer, { authTagLength: 16 });
    const dataString = dataPrefix + JSON.stringify(data);
    let encryptedBuffer = cipher.update(dataString);
    encryptedBuffer = Buffer.concat([encryptedBuffer, cipher.final()]);

    return {
        ivHex: ivBuffer.toString('hex'),
        encryptedDataHex: encryptedBuffer.toString('hex'),
        authTag: cipher.getAuthTag().toString('hex'),
    };
};

export const decryptData = <T>(ivHex: string, encryptedDataHex: string, key: string, authTagHex: string): T => {
    const keyBuffer = getKeyBuffer(key);
    const ivBuffer = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    if (ivBuffer.length !== ivSize) {
        throw new Error(`decryptData: iv is the wrong length - expected ${ivSize}, got ${ivBuffer.length}`);
    }

    const encryptedBuffer = Buffer.from(encryptedDataHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    decipher.setAuthTag(authTag);
    let decryptedBuffer = decipher.update(encryptedBuffer);
    decryptedBuffer = Buffer.concat([decryptedBuffer, decipher.final()]);
    const decryptedText = decryptedBuffer.toString();

    /* istanbul ignore if */
    if (!decryptedText.startsWith(dataPrefix)) {
        throw new Error('decryptData: Decrypted data is missing the expected prefix');
    }
    return JSON.parse(decryptedText.substr(dataPrefix.length));
};

export const encryptUrl = <T>(url: string, data: T, key: string, additionalParams: ParsedUrlQuery = {}): string => {
    const encrypt = encryptData(data, key);
    const queryString: ParsedUrlQuery = {
        iv: encrypt.ivHex,
        data: encrypt.encryptedDataHex,
        authTag: encrypt.authTag,
        ...additionalParams,
    };
    return `${url}?${stringify(queryString)}`;
};

export const decryptUrl = <T>(url: string, key: string): T => {
    const urlData = parseUrl(url, true);
    const { iv, data, authTag, ...rest } = urlData.query;
    const ivString = (iv || '').toString();
    const dataString = (data || '').toString();
    const authTagString = (authTag || '').toString();

    if (!data || !ivString || !authTagString) {
        throw new Error('decryptUrl: querystring is missing "data" and / or "iv" and / or "authTag" parameter(s)');
    }

    const decrypted = decryptData<T>(ivString, dataString, key, authTagString);

    return { ...decrypted, ...rest };
};
