import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { generateHtmlUnorderedList } from './emailUnorderedList';

describe('Email components - emailUnorderedList', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('generateHtmlUnorderedList', () => {
        it('should generate a html unordered list', async () => {
            const content = 'Test content';

            const generatedHtmlList = generateHtmlUnorderedList(content);

            expect(generatedHtmlList).toBe(`<ul>${content}</ul>`);
        });
    });
});
