const MATCH_HTML_REGEX = /["'&<>]/;

export function escapeHtml(input: string): string {
    const str = `${input}`;
    const match = MATCH_HTML_REGEX.exec(str);

    if (!match) {
        return str;
    }

    let lastIndex = 0;
    let html = '';
    let index = 0;
    let escape: string;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;';
                break;
            case 38: // &
                escape = '&amp;';
                break;
            case 39: // '
                escape = '&#39;';
                break;
            case 60: // <
                escape = '&lt;';
                break;
            case 62: // >
                escape = '&gt;';
                break;
            default:
                continue;
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
