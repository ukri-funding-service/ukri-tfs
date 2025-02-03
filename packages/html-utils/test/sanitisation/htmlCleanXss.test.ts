import { describe, expect, it } from '@jest/globals';
import fs from 'fs';
import { htmlClean } from '../../src/sanitisation/htmlClean';

const xssStringsPath = './test/sanitisation/xssHtml.txt';
const xssSelfClosingStringsPath = './test/sanitisation/xssSelfClosingHtml.txt';

const loadXssStrings = (path: string): string[] => {
    return fs
        .readFileSync(path) // read file
        .toString() // convert to string
        .split('\n') // split line by line
        .map(s => s.replace('\r', '')); // remove the carriage return
};

/**
 * sanitize-html already performs a suite of tests for XSS. https://github.com/apostrophecms/sanitize-html/blob/main/test/test.js
 * This suite is to ensure our configuration is working as expected.
 */
describe('XSS string removal on standard HTML', () => {
    // given
    loadXssStrings(xssStringsPath).forEach(function (xssString) {
        it(`Remove all HTML and contents from ${xssString}`, function () {
            // when
            const clean = htmlClean(xssString);
            // then
            expect(clean).toEqual('');
        });
    });
});

/**
 * Self closing tags will be removed. Text between two self closing tags will not be.
 * htmlClean(<hr>test</hr>) === "test"
 */
describe('XSS string removal on self closing HTML', () => {
    // given
    loadXssStrings(xssSelfClosingStringsPath).forEach(function (xssString) {
        it(`Remove XSS tag from ${xssString} to leave only the text`, function () {
            // when
            const clean = htmlClean(xssString);
            // then
            expect(clean).toEqual('test');
        });
    });
});
