import {
    defaultHtmlCleanOptions,
    GetHtmlCleanOptions,
    htmlClean,
    simpleRichTextEditorCleanOptions,
} from '../../sanitisation';

export interface HtmlCleanMiddlewareOptions {
    /**
     * @description Array of field names to be IGNORED by html clean.
     * Warning: DO NOT PUT XSS SENSITIVE FIELDS HERE!
     */
    fieldsToLeaveUnSanitized: Array<string>;
    /**
     * @description Array of names for Rich Text Editor fields that are expected
     * to contain HTML input. These will be ignored by the html clean middleware
     */
    richTextEditorFields: Array<string | RegExp>;
}

export const getHtmlCleanOptions =
    ({ richTextEditorFields, fieldsToLeaveUnSanitized }: HtmlCleanMiddlewareOptions): GetHtmlCleanOptions =>
    (_value, property) => {
        if (property && richTextEditorFields.findIndex(match => property.match(match)) > -1) {
            return simpleRichTextEditorCleanOptions;
        } else {
            return { ...defaultHtmlCleanOptions, ignoreFields: fieldsToLeaveUnSanitized };
        }
    };

export const getHtmlCleanMiddleware =
    (config: HtmlCleanMiddlewareOptions) =>
    (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req: { body: any },
        _res: unknown,
        next: () => void,
    ): void => {
        req.body = htmlClean(req.body, getHtmlCleanOptions(config));
        next();
    };
