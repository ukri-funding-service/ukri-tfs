// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives

export const filterEmptySources = (source: string): boolean => source.length > 0;

export abstract class Directive {
    constructor(readonly name: string, readonly orderedSources: string[]) {}

    serialize(): string {
        return this.name + ' ' + this.orderedSources.filter(filterEmptySources).join(' ');
    }
}
