import { wordCount, wordCountHtml, wordLimitExceeded, wordLimitExceededHtml } from '../../src/utils/text/wordcount';
import { describe, expect, it } from '@jest/globals';

describe('Text helper tests', () => {
    describe('plain text', () => {
        const emptyString = '';
        const blankString = '   \n   \r \t   ';
        const oneWord = '  one-word      ';
        const tenWords = '  This answer is acceptable, because it contains exactly ten words. ';
        const tenWordsWithNumberAsDigits = '  This answer is acceptable, because it contains exactly 10 words. ';
        const tenWordsWithApostropheAndAccents =
            "  answers including words like clich\u00e9 and na\u00efve, they'll still pass";
        const tenWordsWithUnicodeLetters = "On Fat Thursday, some people eat p\u0105czki. They're quite tasty!";
        const tenWordsWithUnicodeNonLetters =
            '  This answer is \u2018acceptable\u2019, because it\u2e18 contains exactly ten \u201cwords\u201d ';
        const elevenWords = 'this answer is more than the ten words that are allowed';
        const elevenWordsWithNumberAsDigits = 'this answer is more than the 10 words that are allowed';

        const sampleText = `
-33m O’Leary Dunning-Kruger 5500mAh €5.500,00 *this is a test* (so is this)

6-4=2 ,.

a^2+b^2=c^2

18 words total!
`;
        describe('wordCount tests', () => {
            it('should return a word count of 0 given an empty string', async () => {
                const count = wordCount(emptyString);
                expect(count).toEqual(0);
            });

            it('should return a word count of 0 given a blank string', async () => {
                const count = wordCount(blankString);
                expect(count).toEqual(0);
            });

            it('should return a word count of 1 given a single word', async () => {
                const count = wordCount(oneWord);
                expect(count).toEqual(1);
            });

            it('should return a word count of 10 given ten words', async () => {
                const count = wordCount(tenWords);
                expect(count).toEqual(10);
            });

            it('should return a word count of 10 given ten words using digits to represent the number', async () => {
                const count = wordCount(tenWordsWithNumberAsDigits);
                expect(count).toEqual(10);
            });

            it('should return a word count of 10 given ten words including non-letter Unicode characters', async () => {
                const count = wordCount(tenWordsWithUnicodeNonLetters);
                expect(count).toEqual(10);
            });

            it('should return a word count of 10 given ten words including apostrophes and accented characters', async () => {
                const count = wordCount(tenWordsWithApostropheAndAccents);
                expect(count).toEqual(10);
            });

            it('should return a word count of 10 given ten words including Unicode letters', async () => {
                const count = wordCount(tenWordsWithUnicodeLetters);
                expect(count).toEqual(10);
            });

            it('should return a word count of 10 given ten words including non-letter Unicode characters', async () => {
                const count = wordCount(tenWordsWithUnicodeNonLetters);
                expect(count).toEqual(10);
            });

            it('should return a word count of 11 given eleven words', async () => {
                const count = wordCount(elevenWords);
                expect(count).toEqual(11);
            });

            it('should return a word count of 11 given eleven words using digits to represent the number', async () => {
                const count = wordCount(elevenWordsWithNumberAsDigits);
                expect(count).toEqual(11);
            });

            it('should return a word count of 18 given the sample text', async () => {
                const count = wordCount(sampleText);
                expect(count).toEqual(18);
            });
        });

        describe('wordLimitExceeded tests', () => {
            it('should return false given ten words', async () => {
                const tooMany = wordLimitExceeded(10, tenWords);
                expect(tooMany).toBeFalsy();
            });

            it('should return false given ten words using digits to represent the number', async () => {
                const tooMany = wordLimitExceeded(10, tenWordsWithNumberAsDigits);
                expect(tooMany).toBeFalsy();
            });

            it('should return false given ten words including non-letter Unicode characters', async () => {
                const tooMany = wordLimitExceeded(10, tenWordsWithUnicodeNonLetters);
                expect(tooMany).toBeFalsy();
            });

            it('should return false given ten words including apostrophes and accented characters', async () => {
                const tooMany = wordLimitExceeded(10, tenWordsWithApostropheAndAccents);
                expect(tooMany).toBeFalsy();
            });

            it('should return false given ten words including Unicode letters', async () => {
                const tooMany = wordLimitExceeded(10, tenWordsWithUnicodeLetters);
                expect(tooMany).toBeFalsy();
            });

            it('should return false given ten words including non-letter Unicode characters', async () => {
                const tooMany = wordLimitExceeded(10, tenWordsWithUnicodeNonLetters);
                expect(tooMany).toBeFalsy();
            });

            it('should return true given eleven words', async () => {
                const tooMany = wordLimitExceeded(10, elevenWords);
                expect(tooMany).toBeTruthy();
            });

            it('should return true given eleven words using digits to represent the number', async () => {
                const tooMany = wordLimitExceeded(10, elevenWordsWithNumberAsDigits);
                expect(tooMany).toBeTruthy();
            });

            it('should return true given a word limit of 17 and the sample text', async () => {
                const tooMany = wordLimitExceeded(17, sampleText);
                expect(tooMany).toBeTruthy();
            });

            it('should return false given a word limit of 18 and the sample text', async () => {
                const tooMany = wordLimitExceeded(18, sampleText);
                expect(tooMany).toBeFalsy();
            });
        });
    });

    describe('html text', () => {
        describe('wordcountHtml', () => {
            it('should count words without tags', () => {
                const count = wordCountHtml('one two three');
                expect(count).toEqual(3);
            });

            it('should count words with tags where the tags are not separated by whitespace', () => {
                const count = wordCountHtml('<p>one two three</p>');
                expect(count).toEqual(3);
            });

            it('should count words with tags where the tags are not separated by whitespace', () => {
                const count = wordCountHtml('<p> one two three </p>');
                expect(count).toEqual(3);
            });

            it('should disregards empty space between tags', () => {
                const count = wordCountHtml('<p>          </p>');
                expect(count).toEqual(0);
            });

            it('should count words with nested tags', () => {
                const count = wordCountHtml('<p>one two three <div> four five </div></p>');
                expect(count).toEqual(5);
            });
        });

        describe('wordLimitExceededHtml', () => {
            it('should return false when there are fewer words than the limit', () => {
                const exceeded = wordLimitExceededHtml(
                    8,
                    '<p> there are <em> seven </em> words but <strong> thirteen </strong> tokens </p>',
                );
                expect(exceeded).toBe(false);
            });

            it('should return true when there are more words than the limit', () => {
                const exceeded = wordLimitExceededHtml(
                    5,
                    '<p> there are <em> seven </em> words but <strong> thirteen </strong> tokens </p>',
                );
                expect(exceeded).toBe(true);
            });
        });
    });
});
