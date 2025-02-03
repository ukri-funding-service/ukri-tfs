/* eslint-disable @typescript-eslint/no-explicit-any */
import sanitise, { IOptions } from '@ukri-tfs/sanitize-html';

type Whitelist = string[];

type DetailedWhitelist = {
    [k: string]: Whitelist;
};

type StylesWhitelist = { [index: string]: { [index: string]: RegExp[] } };

export interface HtmlCleanOptions {
    allowedTags: Whitelist;
    allowedAttributes: DetailedWhitelist;
    allowedClasses: DetailedWhitelist;
    allowedStyles: StylesWhitelist;
    removeInnerTextFromDisallowedTag: boolean;
    ignoreFields: string[];
}

export type GetHtmlCleanOptions = (value: string, property?: string) => HtmlCleanOptions;

function convertGenericOptionsToSanitizeHtmlOptions(options: HtmlCleanOptions): IOptions {
    return {
        allowedClasses: options.allowedClasses,
        allowedTags: options.allowedTags,
        allowedAttributes: options.allowedAttributes,
        allowedStyles: options.allowedStyles,
        textFilter: (text: string, tag: string) => {
            // if we are looking at html and the consumer wants inner text to be removed for disallowed html
            if (tag && options.removeInnerTextFromDisallowedTag) {
                // if this tag is not part of the whitelist
                if (!options.allowedTags.includes(tag)) {
                    return '';
                }
            }
            return text;
        },
    };
}

export const defaultHtmlCleanOptions: HtmlCleanOptions = {
    allowedTags: [],
    allowedAttributes: {},
    allowedClasses: {},
    allowedStyles: {},
    removeInnerTextFromDisallowedTag: true,
    ignoreFields: [],
};

export const defaultHtmlCleanOptionsWithInnerText: HtmlCleanOptions = {
    allowedTags: [],
    allowedAttributes: {},
    allowedClasses: {},
    allowedStyles: {},
    removeInnerTextFromDisallowedTag: false,
    ignoreFields: [],
};

export const simpleRichTextEditorCleanOptions: HtmlCleanOptions = {
    allowedTags: [
        'h1',
        'h2',
        'h3',
        'p',
        'br',
        'strong',
        'u',
        'em',
        'ol',
        'ul',
        'li',
        'a',
        'span',
        'table',
        'thead',
        'tr',
        'th',
        'tbody',
        'td',
        'caption',
        'sup',
        'sub',
        'img',
        'div',
    ],
    allowedAttributes: {
        a: ['href', 'target'],
        p: ['style'],
        table: ['style'],
        td: ['colspan', 'rowspan', 'style', 'scope'],
        th: ['colspan', 'rowspan', 'style', 'scope'],
        tr: ['style'],
        span: ['style'],
        li: ['style'],
        img: ['src', 'alt', 'width', 'height', 'app-image-id', 'title', 'aria-label'],
    },
    allowedClasses: {
        h1: ['govuk-heading-l'],
        h2: ['govuk-heading-m'],
        h3: ['govuk-heading-s'],
        p: ['govuk-body'],
        a: ['govuk-link'],
        ul: ['govuk-list', 'govuk-list--bullet'],
        ol: ['govuk-list', 'govuk-list--number'],
        table: ['govuk-table', 'responsive-table'],
        thead: ['govuk-table__head'],
        tr: ['govuk-table__row'],
        th: ['govuk-table__header'],
        tbody: ['govuk-table__body'],
        td: ['govuk-table__cell'],
        caption: ['govuk-table__caption'],
    },
    allowedStyles: {
        p: {
            'padding-left': [/^\d+\.?\d*(px|pt|em|rem)$/i],
        },
        table: {
            'border-collapse': [/^collapse$/i],
            width: [/^\d+\.?\d*(%|px|pt|em|rem)$/i],
            height: [/^\d+\.?\d*(%|px|pt|em|rem)$/i],
            float: [/^(left|right)$/i],
            'margin-left': [/^auto$/i],
            'margin-right': [/^auto$/i],
        },
        tr: {
            height: [/^\d+\.?\d*(%|px|pt|em|rem)$/i],
            'text-align': [/^(center|left|right)$/i],
        },
        td: {
            width: [/^\d+\.?\d*(%|px|pt|em|rem)$/i],
            height: [/^\d+\.?\d*(%|px|pt|em|rem)$/i],
            'text-align': [/^center|left|right$/i],
            'vertical-align': [/^top|middle|bottom$/i],
        },
        th: {
            width: [/^\d+\.?\d*(%|px|pt|em|rem)$/i],
            height: [/^\d+\.?\d*(%|px|pt|em|rem)$/i],
            'text-align': [/^(center|left|right)$/i],
            'vertical-align': [/^(top|middle|bottom)$/i],
        },
        span: {
            'text-decoration': [/^underline$/i],
        },
        li: {
            'list-style-type': [/^none$/i],
        },
    },
    removeInnerTextFromDisallowedTag: true,
    ignoreFields: [],
};

/**
 * Removes HTML from the passed in argument. Only strings can be cleaned, other types will be ignored.
 * Function will recursively (depth first) call itself on nested lists and objects until entire tree has been cleaned.
 *
 * Has been configured with defaults:
 * - allowedTags: `[]`
 * - allowedAttributes: `{}`
 * - allowedClasses: `{}`
 * - removeInnerTextFromDisallowedTag: `true`
 * - ignoreFields: `[]`
 *
 * @param dirty Object, List, or string that needs cleaning to remove HTML.
 * @param options for the underlying sanitize-html call as HtmlCleanOptions or a function that returns HtmlCleanOptions
 * @param parentProps the parent property path
 */
export const htmlClean = <T>(
    dirty: T,
    options: HtmlCleanOptions | GetHtmlCleanOptions = defaultHtmlCleanOptions,
    parentProps = '',
): T => {
    return htmlCleanAny(dirty, options, parentProps);
};

const htmlCleanAny = (dirty: any, options: HtmlCleanOptions | GetHtmlCleanOptions, parentProps: string): any => {
    if (dirty) {
        if (Array.isArray(dirty)) {
            return dirty.map((dirtyItem, idx) => {
                const propsPath = `${parentProps}[${idx}]`;
                return htmlClean(dirtyItem, options, propsPath);
            });
        } else if (typeof dirty === 'object') {
            const cleaned = Object.keys(dirty).reduce((cleanObject, key) => {
                let value = dirty[key];
                const propsPath = `${parentProps ? parentProps + '.' : ''}${key}`;
                const cleanOptions = options instanceof Function ? options(value, propsPath) : options;

                if (!cleanOptions.ignoreFields.includes(key)) {
                    value = htmlClean(value, options, propsPath);
                }
                return { ...cleanObject, [key]: value };
            }, {});
            return cleaned;
        } else if (typeof dirty === 'string') {
            const cleanOptions = options instanceof Function ? options(dirty, parentProps) : options;
            return sanitise(dirty, convertGenericOptionsToSanitizeHtmlOptions(cleanOptions));
        }
    }
    return dirty;
};
