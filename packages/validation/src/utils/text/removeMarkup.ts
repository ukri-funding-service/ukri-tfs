import sanitise, { IOptions } from '@ukri-tfs/sanitize-html';
import { decode } from 'html-entities';

const defaultRemoveMarkupOptions: IOptions = {
    allowedClasses: {},
    allowedTags: [],
    allowedAttributes: {},
    allowedStyles: {},
    disallowedTagsMode: 'discard',
};

export function unsafeRemoveMarkup(html: string | null, removeOptions = defaultRemoveMarkupOptions): string {
    // This function decodes html entities for character count purposes. The output is not guarateed to be safe.
    if (html) {
        const removedTags = sanitise(html.replace(/\r?\n/g, '\n\n').replace(/<br\s?\/?>/gi, '\n'), {
            ...defaultRemoveMarkupOptions,
            ...removeOptions,
        });
        return decode(removedTags); // This is unsafe and output should not be put on a page
    }
    return '';
}
