export interface ServiceHostNames<T extends string> {
    getUrl(varName: T): URL;
}
