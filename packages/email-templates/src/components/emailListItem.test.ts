import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { generateHtmlListItem } from './emailListItem';

describe('Email components - emailListItem', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('generateHtmlListItem', () => {
        it('should generate a html list item', async () => {
            const content = 'Test content';

            const generatedHtmlListItem = generateHtmlListItem(content);

            expect(generatedHtmlListItem).toBe(`<li>${content}</li>`);
        });
    });
});
