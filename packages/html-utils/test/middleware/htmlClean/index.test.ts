import { describe, expect, it, jest } from '@jest/globals';
import { getHtmlCleanMiddleware, getHtmlCleanOptions } from '../../../src/middleware/htmlClean';

describe('getHtmlCleanOptions', () => {
    it('has rich text defaults', () => {
        const options = getHtmlCleanOptions({ fieldsToLeaveUnSanitized: [], richTextEditorFields: ['world'] });
        const option = options('hello', 'world');
        expect(option.allowedTags).toContain('h1');
    });

    it('has other defaults', () => {
        const options = getHtmlCleanOptions({ fieldsToLeaveUnSanitized: [], richTextEditorFields: [] });
        const option = options('hello', 'world');
        expect(option.allowedTags).toEqual([]);
    });
});

describe('getHtmlCleanMiddleware', () => {
    it('calls next', () => {
        const middleware = getHtmlCleanMiddleware({ fieldsToLeaveUnSanitized: [], richTextEditorFields: [] });
        const next = jest.fn();
        middleware({ body: {} }, {}, next);
        expect(next).toHaveBeenCalled();
    });
});
