import { expect } from 'chai';
import { escapeHtml } from '../src/escape-html';
import 'mocha';

describe('Escaping HTML characters in input', () => {
    it('Escapes special HTML characters', async () => {
        expect(escapeHtml('<script>"&" = "&"</script>')).to.equal(
            '&lt;script&gt;&quot;&amp;&quot; = &quot;&amp;&quot;&lt;/script&gt;',
        );
    });
});
