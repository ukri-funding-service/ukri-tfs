import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { generateHtmlList } from './emailList';

describe('Email components - emailList', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('generateHtmlList', () => {
        it('should generate a html list', async () => {
            const content = 'Test content';

            const generatedHtmlList = generateHtmlList(content);

            expect(generatedHtmlList).toBe(`<ol>${content}</ol>`);
        });
    });
});
