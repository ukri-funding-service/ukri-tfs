import { Directive } from './directive';

//https://developer.mozilla.org/en-US/docs/Glossary/Fetch_directive

export type FetchDirectiveName =
    | 'child-src'
    | 'connect-src'
    | 'default-src'
    | 'font-src'
    | 'frame-src'
    | 'img-src'
    | 'manifest-src'
    | 'media-src'
    | 'object-src'
    | 'prefetch-src'
    | 'script-src'
    | 'script-src-elem'
    | 'script-src-attr'
    | 'style-src'
    | 'style-src-elem'
    | 'style-src-attr'
    | 'worker-src';

export class FetchDirective extends Directive {
    constructor(readonly name: FetchDirectiveName, readonly orderedClauses: string[]) {
        super(name, orderedClauses);
    }
}
