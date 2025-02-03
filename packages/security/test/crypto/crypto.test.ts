import { describe, expect, it } from '@jest/globals';
import { ParsedUrlQuery } from 'querystring';
import { decryptUrl, encryptUrl } from '../../src/crypto';

const testUrl = 'http://www.test.com/test';
const testData: TestData = {
    key1: 'test test',
    key2: 555,
};

interface TestData {
    key1: string;
    key2: number;
}

describe('crypto tests', () => {
    const iv = '825533232dbc8055b2daea0acff626ff';
    it('should throw an exception if the encryption key is not set', () => {
        const encrypt = () => encryptUrl('testUrl', testData, '');

        expect(encrypt).toThrow('The encryption key must be a 32 character string');
    });

    it('should encrypt a URL and maintain the original base url', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const encrypted = encryptUrl(testUrl, testData, key);

        expect(encrypted).toMatch(new RegExp('^http:\\/\\/www.test.com\\/test\\?'));
    });

    it('should encrypt a URL and include an iv property', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const encrypted = encryptUrl(testUrl, testData, key);

        expect(encrypted).toMatch(new RegExp('[?&]iv=[a-f0-9]+'));
    });

    it('should encrypt a URL and include a data property', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const encrypted = encryptUrl(testUrl, testData, key);

        expect(encrypted).toMatch(new RegExp('[?&]data=[a-f0-9]+'));
    });

    it('should encrypt a URL and include an authTag property', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const encrypted = encryptUrl(testUrl, testData, key);

        expect(encrypted).toMatch(new RegExp('[?&]authTag=[a-f0-9]{32}'));
    });

    it('should successfully encrypt and decrypt to the original data', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const encrypted = encryptUrl(testUrl, testData, key);
        const decrypted: TestData = decryptUrl(encrypted, key);

        expect(decrypted).toEqual({ key1: 'test test', key2: 555 });
    });

    it('should successfully decrypt to original data with an older encryption', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const encrypted = `http://www.test.com/test?iv=${iv}&data=2b4e2c8ea541d180be28ec8846aa6dcc0a4c68f3881f48dab25a8472305dd1afcf17867a14&authTag=ecf0d1bc05f170381c0b1a3b4e92408a`;

        const decrypted: TestData = decryptUrl(encrypted, key);

        expect(decrypted).toEqual({ key1: 'test test', key2: 555 });
    });

    it('should fail to decrypt if the required params are not provided', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5s';
        const encrypted = 'http://www.test.com/test';

        expect(() => decryptUrl(encrypted, key)).toThrow(
            'decryptUrl: querystring is missing "data" and / or "iv" and / or "authTag" parameter(s)',
        );
    });

    it('should fail to decrypt to original data with the wrong key', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5s';
        const encrypted = `http://www.test.com/test?iv=${iv}&data=2b4e2c8ea541d180be28ec8846aa6dcc0a4c68f3881f48dab25a8472305dd1afcf17867a14&authTag=ecf0d1bc05f170381c0b1a3b4e92408a`;

        expect(() => decryptUrl(encrypted, key)).toThrow('Unsupported state or unable to authenticate data');
    });

    it('should fail to decrypt to original data with an invalid iv', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const invalidIv = '0' + iv.substring(1);
        const encrypted = `http://www.test.com/test?iv=${invalidIv}&data=2b4e2c8ea541d180be28ec8846aa6dcc0a4c68f3881f48dab25a8472305dd1afcf17867a14&authTag=ecf0d1bc05f170381c0b1a3b4e92408a`;

        expect(() => decryptUrl(encrypted, key)).toThrow('Unsupported state or unable to authenticate data');
    });

    it('should fail to decrypt to original data with a short iv', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const invalidIv = iv.substring(4);
        const encrypted = `http://www.test.com/test?iv=${invalidIv}&data=2b4e2c8ea541d180be28ec8846aa6dcc0a4c68f3881f48dab25a8472305dd1afcf17867a14&authTag=ecf0d1bc05f170381c0b1a3b4e92408a`;

        expect(() => decryptUrl(encrypted, key)).toThrow('decryptData: iv is the wrong length - expected 16, got 14');
    });

    it('should fail to decrypt to original data with an invalid data', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const encrypted = `http://www.test.com/test?iv=${iv}&data=2bae2c8ea541d180be28ec8846aa6dcc0a4c68f3881f48dab25a8472305dd1afcf17867a14&authTag=ecf0d1bc05f170381c0b1a3b4e92408a`;

        expect(() => decryptUrl(encrypted, key)).toThrow('Unsupported state or unable to authenticate data');
    });

    it('should fail to decrypt to original data with an invalid authTag', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const encrypted = `http://www.test.com/test?iv=${iv}&data=2b4e2c8ea541d180be28ec8846aa6dcc0a4c68f3881f48dab25a8472305dd1afcf17867a14&authTag=ecf0d1bc05f170381c0b1a3b4e92408b`;

        expect(() => decryptUrl(encrypted, key)).toThrow('Unsupported state or unable to authenticate data');
    });

    it('should encrypt a URL to the correct format (with additional parameters)', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const additionalParams: ParsedUrlQuery = {
            addParam1: '123',
            addParam2: 'abc',
            addParam3: ' %*&? ',
        };
        const encrypted = encryptUrl(testUrl, testData, key, additionalParams);

        expect(encrypted).toMatch(new RegExp('^http:\\/\\/www.test.com\\/test\\?'));
        expect(encrypted).toMatch(new RegExp('[?&]iv=[a-f0-9]+'));
        expect(encrypted).toMatch(new RegExp('[?&]data=[a-f0-9]+'));
        expect(encrypted).toMatch(new RegExp('[?&]addParam1=123'));
        expect(encrypted).toMatch(new RegExp('[?&]addParam2=abc'));
        expect(encrypted).toMatch(new RegExp('[?&]addParam3=%20%25\\*%26%3F%20'));
    });

    it('should successfully encrypt and decrypt to the original data (with additional parameters)', () => {
        const key = 'eThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u';
        const additionalParams: ParsedUrlQuery = {
            addParam1: '123',
            addParam2: 'abc',
            addParam3: ' %*&? ',
        };
        const encrypted = encryptUrl(testUrl, testData, key, additionalParams);
        const decrypted = decryptUrl(encrypted, key);

        expect(decrypted).toEqual({
            key1: 'test test',
            key2: 555,
            addParam1: '123',
            addParam2: 'abc',
            addParam3: ' %*&? ',
        });
    });
});
