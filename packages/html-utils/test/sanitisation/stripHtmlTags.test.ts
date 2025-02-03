import { describe, expect, it } from '@jest/globals';
import { stripHtmlTags } from '../../src';

describe('stripHtmlTags', () => {
    it('should return a plain string removing the html tags', async () => {
        const message = '<p>hi</p><p>hi</p>';
        const result = stripHtmlTags(message);
        expect(result).toBe('hi hi');
    });
});
