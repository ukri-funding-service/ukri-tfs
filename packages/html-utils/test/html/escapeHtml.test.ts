import { describe, expect, it } from '@jest/globals';
import { escapeHtml } from '../../src/sanitisation/escapeHtml';

describe('packages/html-utils - html/escapeHtml', () => {
    it('Escapes special HTML characters', async () => {
        expect(escapeHtml(`<script>"&" = '&'</script>`)).toEqual(
            '&lt;script&gt;&quot;&amp;&quot; = &#39;&amp;&#39;&lt;/script&gt;',
        );
    });

    it('returns the input if it is not html', () => {
        expect(escapeHtml('not html')).toEqual('not html');
    });
});
