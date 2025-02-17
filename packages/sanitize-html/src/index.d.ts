// Type definitions for sanitize-html 1.23.0
// Project: https://github.com/punkave/sanitize-html
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2
// License: MIT

import { ParserOptions } from 'htmlparser2';

export = sanitize;

declare function sanitize(dirty: string, options?: sanitize.IOptions): string;

declare namespace sanitize {
    type Attributes = { [attr: string]: string };

    type Tag = { tagName: string; attribs: Attributes; text?: string };

    type Transformer = (tagName: string, attribs: Attributes) => Tag;

    type AllowedAttribute = string | { name: string; multiple?: boolean; values: string[] };

    type DisallowedTagsModes = 'discard' | 'escape' | 'recursiveEscape';

    interface IDefaults {
        allowedAttributes: { [index: string]: AllowedAttribute[] };
        allowedSchemes: string[];
        allowedSchemesByTag: { [index: string]: string[] };
        allowedSchemesAppliedToAttributes: string[];
        allowedTags: string[];
        allowProtocolRelative: boolean;
        disallowedTagsMode: string;
        enforceHtmlBoundary: boolean;
        selfClosing: string[];
    }

    interface IFrame {
        tag: string;
        attribs: { [index: string]: string };
        text: string;
        tagPosition: number;
    }

    interface IOptions {
        allowedAttributes?: { [index: string]: AllowedAttribute[] } | boolean;
        allowedStyles?: { [index: string]: { [index: string]: RegExp[] } };
        allowedClasses?: { [index: string]: string[] | boolean };
        allowedIframeHostnames?: string[];
        allowIframeRelativeUrls?: boolean;
        allowedSchemes?: string[] | boolean;
        allowedSchemesByTag?: { [index: string]: string[] } | boolean;
        allowedSchemesAppliedToAttributes?: string[];
        allowProtocolRelative?: boolean;
        allowedTags?: string[] | boolean;
        textFilter?: (text: string, tagName: string) => string;
        exclusiveFilter?: (frame: IFrame) => boolean;
        nonTextTags?: string[];
        selfClosing?: string[];
        transformTags?: { [tagName: string]: string | Transformer };
        parser?: ParserOptions;
        disallowedTagsMode?: DisallowedTagsModes;
        /**
         * Setting this option to true will instruct sanitize-html to discard all characters outside of html tag boundaries
         * -- before `<html>` and after `</html>` tags
         * @see {@link https://github.com/apostrophecms/sanitize-html/#discarding-text-outside-of-htmlhtml-tags}
         * @default true
         */
        enforceHtmlBoundary?: boolean;
    }

    const defaults: IDefaults;

    function simpleTransform(tagName: string, attribs: Attributes, merge?: boolean): Transformer;
}
