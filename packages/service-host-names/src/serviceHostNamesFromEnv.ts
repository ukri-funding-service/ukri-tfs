import { ServiceHostNames } from './serviceHostNames';

export class ServiceHostNamesFromEnv<T extends string> implements ServiceHostNames<T> {
    getUrl(varName: T): URL {
        const url = process.env[varName] ?? '';
        try {
            return new URL(url);
        } catch (e) {
            throw new Error(`${e} var name=${varName}, value=${url}`);
        }
    }
}
