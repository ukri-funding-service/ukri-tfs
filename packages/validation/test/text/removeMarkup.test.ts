import { unsafeRemoveMarkup } from '../../src/utils/text/removeMarkup';
import { describe, expect, it } from '@jest/globals';

describe('unsafeRemoveMarkup', () => {
    it('should decode html entities', () => {
        const dirty = '&lt;test&gt;';

        const clean = unsafeRemoveMarkup(dirty);

        expect(clean).toEqual('<test>');
    });

    it('should not remove content, only tags', () => {
        const dirty = '<table>Some table info</table>';

        const clean = unsafeRemoveMarkup(dirty);

        expect(clean).toEqual('Some table info');
    });

    it('should replace new line (with carriage return) with 2 new lines', () => {
        const dirty = '<p>one\r\ntwo</p>';

        const clean = unsafeRemoveMarkup(dirty);

        expect(clean).toEqual('one\n\ntwo');
    });

    it('should replace new line (without carriage return) with 2 new lines', () => {
        const dirty = '<p>one\ntwo</p>';

        const clean = unsafeRemoveMarkup(dirty);

        expect(clean).toEqual('one\n\ntwo');
    });

    it('should replace <br> tag with 1 new line', () => {
        const dirty = '<p>one<br>two</p>';

        const clean = unsafeRemoveMarkup(dirty);

        expect(clean).toEqual('one\ntwo');
    });

    it('should not remove specified allowed tags', () => {
        const dirty = '<p>one<br>two<img src="http://domain/img.jpg"/></p>';

        const clean = unsafeRemoveMarkup(dirty, { allowedTags: ['img'] });

        expect(clean).toEqual('one\ntwo<img />');
    });
});
